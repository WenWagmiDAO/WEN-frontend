import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box, Slide } from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { redeemBond } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { trim, secondsUntilBlock, prettifySeconds, prettyVestingPeriod } from "../../helpers";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import TxnButtonText from "src/components/TxnButtonText";
import { Skeleton } from "@material-ui/lab";
import { DisplayBondDiscount } from "./Bond";
import ConnectButton from "../../components/ConnectButton";
import { OHM_TICKER } from "../../constants";

function BondRedeem({ bond }) {
  // const { bond: bondName } = bond;
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const isBondLoading = useSelector(state => state.bonding.loading ?? true);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const bondingState = useSelector(state => {
    return state.bonding && state.bonding[bond.name];
  });
  const bondDetails = useSelector(state => {
    return state.account.bonds && state.account.bonds[bond.name];
  });
  const blockRateSeconds = useSelector(state => {
    return state.app.blockRateSeconds;
  });

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: chainID, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock, blockRateSeconds);
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bondingState.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock, blockRateSeconds);
    return prettifySeconds(seconds, "day");
  };

  useEffect(() => {
    console.log(bond);
    console.log(bondingState);
    console.log(bondDetails);
  }, []);

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-btn"
              className="transaction-button"
              fullWidth
              disabled={
                isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name) ||
                isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name + "_autostake") ||
                bond.pendingPayout == 0.0
              }
              onClick={() => {
                onRedeem({ autostake: false });
              }}
            >
              <TxnButtonText
                pendingTransactions={pendingTransactions}
                type={"redeem_bond_" + bond.name}
                defaultText={<Trans>Claim</Trans>}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-autostake-btn"
              className="transaction-button"
              fullWidth
              disabled={
                isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name + "_autostake") ||
                isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name) ||
                bond.pendingPayout == 0.0
              }
              onClick={() => {
                onRedeem({ autostake: true });
              }}
            >
              <TxnButtonText
                pendingTransactions={pendingTransactions}
                type={"redeem_bond_" + bond.name + "_autostake"}
                defaultText={<Trans>Claim and Autostake</Trans>}
              />
            </Button>
          </>
        )}
      </Box>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <div className="data-row">
            <Typography>
              <Trans>Pending Rewards</Trans>
            </Typography>
            <Typography className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.interestDue, 4)} ${OHM_TICKER}`}
            </Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Claimable Rewards</Trans>
            </Typography>
            <Typography id="claimable" className="price-data">
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.pendingPayout, 4)} ${OHM_TICKER}`}
            </Typography>
          </div>
          <div className="data-row">
            <Typography>
              <Trans>Time until fully vested</Trans>
            </Typography>
            <Typography className="price-data">{isBondLoading ? <Skeleton width="100px" /> : vestingTime()}</Typography>
          </div>

          <div className="data-row">
            <Typography>
              <Trans>ROI</Trans>
            </Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : <DisplayBondDiscount key={bond.name} bond={bond} />}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>
              <Trans>Debt Ratio</Trans>
            </Typography>
            <Typography>
              {isBondLoading ? <Skeleton width="100px" /> : `${trim(bond.debtRatio / 10000000, 2)}%`}
            </Typography>
          </div>

          <div className="data-row">
            <Typography>
              <Trans>Vesting Term</Trans>
            </Typography>
            <Typography>{isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}</Typography>
          </div>
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
