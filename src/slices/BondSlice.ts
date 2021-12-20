import { ethers, BigNumber, BigNumberish } from "ethers";
import { contractForRedeemHelper } from "../helpers";
import { getBalances, calculateUserBondDetails } from "./AccountSlice";
import { pollUpdateState, pollManyUpdateState, PollUpdateStateParams } from "./PollStateUpdateSlice";
import { findOrLoadMarketPrice } from "./AppSlice";
import { error, info } from "./MessagesSlice";
import { clearPendingTxn, fetchPendingTxns } from "./PendingTxnsSlice";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { RootState } from "src/store";
import {
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk,
  ICalcBondDetailsAsyncThunk,
  IJsonRPCError,
  IRedeemAllBondsAsyncThunk,
  IRedeemBondAsyncThunk,
} from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { OHM_TICKER } from "../constants";

export const changeApproval = createAsyncThunk(
  "bonding/changeApproval",
  async ({ address, bond, provider, networkID }: IApproveBondAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserve(networkID, signer);
    const bondAddr = bond.getAddressForBond(networkID);

    let approveTx: any;
    let bondAllowance = await reserveContract.allowance(address, bondAddr);

    // return early if approval already exists
    if (bondAllowance.gt(BigNumber.from("0"))) {
      dispatch(info("Approval completed."));
      dispatch(calculateUserBondDetails({ address, bond, networkID, provider }));
      return;
    }

    try {
      approveTx = await reserveContract.approve(bondAddr, ethers.utils.parseUnits("1000000000", "ether").toString());
      dispatch(
        fetchPendingTxns({
          txnHash: approveTx.hash,
          text: "Approving " + bond.displayName,
          type: "approve_" + bond.name,
        }),
      );
      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (approveTx) {
        dispatch(
          pollUpdateState({
            field: "allowance",
            stateAccessor: `account.bonds[${bond.name}].allowance`,
            thunkToCall: () => dispatch(calculateUserBondDetails({ address, bond, networkID, provider })),
          }),
        );
      }
    }
  },
);

export interface IBondDetails {
  bond: string;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  maxBondPrice: number;
  bondPrice: number;
  marketPrice: number;
  purchaseDisabled: boolean;
}
export const calcBondDetails = createAsyncThunk(
  "bonding/calcBondDetails",
  async ({ bond, value, provider, networkID }: ICalcBondDetailsAsyncThunk, { dispatch }): Promise<IBondDetails> => {
    if (!value || value === "") {
      value = "0";
    }
    const amountInWei = ethers.utils.parseEther(value);
    let purchaseDisabled = false;

    let bondPrice = BigNumber.from(0),
      bondDiscount = 0,
      valuation = 0,
      bondQuote: BigNumberish = BigNumber.from(0);
    const bondContract = bond.getContractForBond(networkID, provider);
    const bondCalcContract = getBondCalculator(networkID, provider);
    let debtRatio: BigNumberish;
    let marketPrice: number = 0;

    const results = await Promise.all([
      bondContract.terms(),
      bondContract.maxPayout(),
      // Could move purchased out into its own action to improve performance
      bond.getTreasuryBalance(networkID, provider),
      bondContract.standardizedDebtRatio(),
      bondContract.bondPriceInUSD(),
      dispatch(findOrLoadMarketPrice({ networkID, provider })).unwrap(),
    ]);
    const terms = results[0];
    const maxBondPrice = results[1] || 0;
    const purchased = results[2] || 0;
    debtRatio = results[3] || BigNumber.from(0);
    bondPrice = results[4] || BigNumber.from(0);
    marketPrice = results[5]?.marketPrice;

    if (isNaN(Number(bondPrice))) {
      console.log("error getting bondPriceInUSD", bond.name, results[3]);
    }
    if (!marketPrice) {
      console.error("Returned a null response from dispatch(findOrLoadMarketPrice)");
    }

    bondDiscount = (marketPrice * Math.pow(10, 18) - Number(bondPrice.toString())) / Number(bondPrice.toString()); // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
    debtRatio = Number(debtRatio.toString()) / Math.pow(10, 9);

    if (Number(value) === 0) {
      // if inputValue is 0 avoid the bondQuote calls
      bondQuote = BigNumber.from(0);
      purchaseDisabled = true;
    } else if (bond.isLP) {
      valuation = Number(
        (await bondCalcContract.valuation(bond.getAddressForReserve(networkID), amountInWei)).toString(),
      );
      bondQuote = await bondContract.payoutFor(valuation);

      if (!amountInWei.isZero() && Number(bondQuote.toString()) < 10000000) {
        bondQuote = BigNumber.from(0);
        const errorString = "Amount is too small!";
        purchaseDisabled = true;
        dispatch(error(errorString));
      } else {
        bondQuote = Number(bondQuote.toString()) / Math.pow(10, 9);
      }
    } else {
      // RFV = DAI
      bondQuote = await bondContract.payoutFor(amountInWei);

      if (!amountInWei.isZero() && Number(bondQuote.toString()) < 10000000000000000) {
        bondQuote = BigNumber.from(0);
        const errorString = "Amount is too small!";
        purchaseDisabled = true;
        dispatch(error(errorString));
      } else {
        bondQuote = Number(bondQuote.toString()) / Math.pow(10, 18);
      }
    }

    // Display error if user tries to exceed maximum.
    if (!!value && parseFloat(bondQuote.toString()) > Number(maxBondPrice.toString()) / Math.pow(10, 9)) {
      const errorString =
        "You're trying to bond more than the maximum payout available! The maximum bond payout is " +
        (Number(maxBondPrice.toString()) / Math.pow(10, 9)).toFixed(2).toString() +
        " " +
        OHM_TICKER +
        ".";
      purchaseDisabled = true;
      dispatch(error(errorString));
    }

    console.log(bond.name, debtRatio);
    return {
      bond: bond.name,
      bondDiscount,
      debtRatio: Number(debtRatio.toString()),
      bondQuote: Number(bondQuote.toString()),
      purchased,
      vestingTerm: Number(terms?.vestingTerm?.toString()),
      maxBondPrice: Number(maxBondPrice.toString()) / Math.pow(10, 9),
      bondPrice: Number(bondPrice.toString()) / Math.pow(10, 18),
      marketPrice: marketPrice,
      purchaseDisabled,
    };
  },
);

export const bondAsset = createAsyncThunk(
  "bonding/bondAsset",
  async ({ value, address, bond, networkID, provider, slippage }: IBondAssetAsyncThunk, { dispatch }) => {
    const depositorAddress = address;
    const acceptedSlippage = slippage / 100 || 0.005; // 0.5% as default
    // parseUnits takes String => BigNumber
    const valueInWei = ethers.utils.parseUnits(value.toString(), "ether");
    let balance;
    // Calculate maxPremium based on premium and slippage.
    // const calculatePremium = await bonding.calculatePremium();
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);
    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(Number(calculatePremium.toString()) * (1 + acceptedSlippage));

    // Deposit the bond
    let bondTx;
    let uaData = {
      address: address,
      value: value,
      type: "Bond",
      bondName: bond.displayName,
      approved: true,
      txHash: "",
    };
    try {
      bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      dispatch(
        fetchPendingTxns({ txnHash: bondTx.hash, text: "Bonding " + bond.displayName, type: "bond_" + bond.name }),
      );
      uaData.txHash = bondTx.hash;
      await bondTx.wait();

      dispatch(
        pollUpdateState({
          field: "interestDue",
          stateAccessor: `account.bonds[${bond.name}].interestDue`,
          thunkToCall: () => dispatch(calculateUserBondDetails({ address, bond, networkID, provider })),
        }),
      );
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else dispatch(error(rpcError.message));
    } finally {
      if (bondTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(bondTx.hash));
      }
    }
  },
);

export const redeemBond = createAsyncThunk(
  "bonding/redeemBond",
  async ({ address, bond, networkID, provider, autostake }: IRedeemBondAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    let redeemTx;
    let uaData = {
      address: address,
      type: "Redeem",
      bondName: bond.displayName,
      autoStake: autostake,
      approved: true,
      txHash: "",
    };
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = "redeem_bond_" + bond.name + (autostake === true ? "_autostake" : "");
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxns({ txnHash: redeemTx.hash, text: "Redeeming " + bond.displayName, type: pendingTxnType }),
      );

      await redeemTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (redeemTx) {
        segmentUA(uaData);
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }

    const statesToPoll: Array<PollUpdateStateParams> = [];

    statesToPoll.push({
      field: "interestDue",
      stateAccessor: `account.bonds[${bond.name}].interestDue`,
      thunkToCall: () => dispatch(calculateUserBondDetails({ address, bond, networkID, provider })),
    });

    statesToPoll.push({
      field: `balances.${autostake ? "sohm" : "ohm"}`,
      stateAccessor: `account.balances.${autostake ? "sohm" : "ohm"}`,
      thunkToCall: () => dispatch(getBalances({ address, networkID, provider })),
    });

    dispatch(pollManyUpdateState({ statesToPoll }));
  },
);

export const redeemAllBonds = createAsyncThunk(
  "bonding/redeemAllBonds",
  async ({ bonds, address, networkID, provider, autostake }: IRedeemAllBondsAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const redeemHelperContract = contractForRedeemHelper({ networkID, provider: signer });

    let redeemAllTx;

    try {
      redeemAllTx = await redeemHelperContract.redeemAll(address, autostake);
      const pendingTxnType = "redeem_all_bonds" + (autostake === true ? "_autostake" : "");

      await dispatch(
        fetchPendingTxns({ txnHash: redeemAllTx.hash, text: "Redeeming All Bonds", type: pendingTxnType }),
      );

      await redeemAllTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (redeemAllTx) {
        dispatch(clearPendingTxn(redeemAllTx.hash));
      }
    }

    const statesToPoll: Array<PollUpdateStateParams> = [];
    bonds &&
      bonds.forEach(async bond => {
        statesToPoll.push({
          field: "interestDue",
          stateAccessor: `account.bonds[${bond.name}].interestDue`,
          thunkToCall: () => dispatch(calculateUserBondDetails({ address, bond, networkID, provider })),
        });
      });

    statesToPoll.push({
      field: `balances.${autostake ? "sohm" : "ohm"}`,
      stateAccessor: `account.balances.${autostake ? "sohm" : "ohm"}`,
      thunkToCall: () => dispatch(getBalances({ address, networkID, provider })),
    });

    dispatch(pollManyUpdateState({ statesToPoll }));
  },
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  status: string;
  [key: string]: any;
}

const setBondState = (state: IBondSlice, payload: any) => {
  const bond = payload.bond;
  const newState = { ...state[bond], ...payload };
  state[bond] = newState;
  state.loading = false;
};

const initialState: IBondSlice = {
  status: "idle",
};

const bondingSlice = createSlice({
  name: "bonding",
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(calcBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.message);
      });
  },
});

export default bondingSlice.reducer;

export const { fetchBondSuccess } = bondingSlice.actions;

const baseInfo = (state: RootState) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
