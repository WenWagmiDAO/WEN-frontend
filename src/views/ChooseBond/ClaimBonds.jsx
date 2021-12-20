import { useEffect, useState } from "react";
import { t, Trans } from "@lingui/macro";
import { ClaimBondTableData, ClaimBondCardData } from "./ClaimRow";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import { TxnButtonTextGeneralPending } from "src/components/TxnButtonText";
import { redeemAllBonds, redeemBond } from "src/slices/BondSlice";
import { calculateUserBondDetails } from "src/slices/AccountSlice";
import CardHeader from "../../components/CardHeader/CardHeader";
import { useWeb3Context } from "src/hooks/web3Context";
import { useAppSelector } from "src/hooks";
import useBonds from "src/hooks/Bonds";
import { IUserBondDetails } from "src/slices/AccountSlice";
import {
  Button,
  Box,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import "./choosebond.scss";
import { useSelector, useDispatch } from "react-redux";

function ClaimBonds() {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const { bonds } = useBonds(chainID);

  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const activeBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  }, _.isEqual);

  const pendingClaim = () => {
    if (
      isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
      isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake") ||
      bonds.some(bond => isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name)) ||
      bonds.some(bond => isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name + "_autostake"))
    ) {
      return true;
    }

    return false;
  };

  const onRedeemAll = async ({ autostake }) => {
    console.log("redeeming all bonds");

    const bondsToRedeem = bonds.filter(bond => activeBonds.some(activeBond => activeBond.bond === bond.name));
    await dispatch(redeemAllBonds({ address, bonds: bondsToRedeem, networkID: chainID, provider, autostake }));

    console.log("redeem all complete");
  };

  useEffect(() => {
    let bondCount = Object.keys(activeBonds || {}).length;
    if (bondCount !== numberOfBonds) setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <>
      {numberOfBonds > 0 && (
        <Zoom in={true}>
          <Paper className="ohm-card claim-bonds-card">
            <CardHeader title="Your Bonds (1,1)" />
            <Box>
              {!isSmallScreen && (
                <TableContainer>
                  <Table aria-label="Claimable bonds">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">
                          <Trans>Bond</Trans>
                        </TableCell>
                        <TableCell align="center">
                          <Trans>Claimable</Trans>
                        </TableCell>
                        <TableCell align="center">
                          <Trans>Pending</Trans>
                        </TableCell>
                        <TableCell align="right">
                          <Trans>Fully Vested</Trans>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(activeBonds).map((bond, i) => (
                        <ClaimBondTableData key={i} userBond={bond} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {isSmallScreen &&
                Object.entries(activeBonds).map((bond, i) => <ClaimBondCardData key={i} userBond={bond} />)}

              <Box
                display="flex"
                justifyContent="center"
                className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
              >
                {numberOfBonds > 1 && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      className="transaction-button"
                      fullWidth
                      disabled={pendingClaim()}
                      onClick={() => {
                        onRedeemAll({ autostake: false });
                      }}
                    >
                      <TxnButtonTextGeneralPending
                        pendingTransactions={pendingTransactions}
                        type="redeem_all_bonds"
                        defaultText={<Trans>Claim all</Trans>}
                      />
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      id="claim-all-and-stake-btn"
                      className="transaction-button"
                      fullWidth
                      disabled={pendingClaim()}
                      onClick={() => {
                        onRedeemAll({ autostake: true });
                      }}
                    >
                      <TxnButtonTextGeneralPending
                        pendingTransactions={pendingTransactions}
                        type="redeem_all_bonds_autostake"
                        defaultText={<Trans>Claim all and Stake</Trans>}
                      />
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>
        </Zoom>
      )}
    </>
  );
}

export default ClaimBonds;
