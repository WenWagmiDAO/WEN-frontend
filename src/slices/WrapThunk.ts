import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as wsOHM } from "../abi/wMemoContract.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, WsOHM } from "src/typechain";
import { pollUpdateState, pollManyUpdateState, PollUpdateStateParams } from "./PollStateUpdateSlice";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, ohmWrap: BigNumber, sohmWrap: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "sWEN") {
    applicableAllowance = sohmWrap;
  } else if (token === "WEN") {
    applicableAllowance = ohmWrap;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    let approveTx;
    let ohmWrap = await ohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
    let sohmWrap = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, ohmWrap, sohmWrap)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          wrapping: {
            ohmWrap: +ohmWrap,
            sohmWrap: +sohmWrap,
          },
        }),
      );
    }

    try {
      if (token === "sWEN") {
        // won't run if wrapAllowance > 0
        approveTx = await sohmContract.approve(
          addresses[networkID].WSOHM_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "WEN") {
        // won't run if wrapAllowance > 0
        approveTx = await ohmContract.approve(
          addresses[networkID].WSOHM_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = "Approve " + (["WEN", "sWEN"].includes(token) ? "Wrapping" : "Unwrapping");
      const pendingTxnType = ["WEN", "sWEN"].includes(token) ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances

    const fetchFreshAllowances = async () => {
      let ohmWrapAllowance = await ohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);
      let sohmWrapAllowance = await sohmContract.allowance(address, addresses[networkID].WSOHM_ADDRESS);

      return dispatch(
        fetchAccountSuccess({
          wrapping: {
            ohmWrap: +ohmWrapAllowance,
            sohmWrap: +sohmWrapAllowance,
          },
        }),
      );
    };

    dispatch(
      pollUpdateState({
        field: `wrapping.${token === "WEN" ? "ohmWrap" : "sohmWrap"}`,
        stateAccessor: `account.wrapping.${token === "WEN" ? "ohmWrap" : "sohmWrap"}`,
        thunkToCall: () => fetchFreshAllowances(),
      }),
    );
  },
);

export const changeWrap = createAsyncThunk(
  "wrap/changeWrap",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const wsohmContract = new ethers.Contract(addresses[networkID].WSOHM_ADDRESS as string, wsOHM, signer) as WsOHM;

    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "wrapFromsOHM") {
        uaData.type = "wrap";
        wrapTx = await wsohmContract.wrapFromsOHM(ethers.utils.parseUnits(value, "gwei"));
      } else if (action === "wrapFromOHM") {
        uaData.type = "wrap";
        wrapTx = await wsohmContract.wrapFromOHM(ethers.utils.parseUnits(value, "gwei"));
      } else if (action === "unwrapToOHM") {
        uaData.type = "unwrap";
        wrapTx = await wsohmContract.unwrapToOHM(ethers.utils.parseUnits(value));
      } else {
        uaData.type = "unwrap";
        wrapTx = await wsohmContract.unwrapTosOHM(ethers.utils.parseUnits(value));
      }
      const pendingTxnType = ["wrapFromsOHM", "wrapFromOHM"].includes(action) ? "wrapping" : "unwrapping";
      uaData.txHash = wrapTx.hash;
      dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: pendingTxnType }));
      await wrapTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
    const unwrapTo = action === "unwrapToOHM" ? "ohm" : "sohm";
    const field = ["wrapFromsOHM", "wrapFromOHM"].includes(action) ? "wsohm" : unwrapTo;

    dispatch(
      pollUpdateState({
        field: `balances.${field}`,
        stateAccessor: `account.balances.${field}`,
        thunkToCall: () => dispatch(getBalances({ address, networkID, provider })),
      }),
    );
  },
);
