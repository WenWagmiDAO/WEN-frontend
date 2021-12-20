import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { BondDataCard, BondTableData } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { formatCurrency } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import { useWeb3Context } from "src/hooks/web3Context";

import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import ClaimBonds from "./ClaimBonds";
import { allBondsMap } from "src/helpers/AllBonds";
import { useAppSelector } from "src/hooks";
import {
  DebtRatioGraph,
  OhmMintedGraph,
  OhmMintedPerTotalSupplyGraph,
} from "../TreasuryDashboard/components/Graph/Graph";
import { QueryClient, QueryClientProvider } from "react-query";
import { useTreasuryOhm } from "../TreasuryDashboard/hooks/useTreasuryOhm";
import styled from "styled-components";
import _ from "lodash";

function ChooseBond() {
  const { chainID } = useWeb3Context();
  const { bonds } = useBonds(chainID);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading: boolean = useAppSelector(state => state.app.loading);
  const isAccountLoading: boolean = useAppSelector(state => state.account.loading);

  const marketPrice: number | undefined = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const { data: ethTreasury } = useTreasuryOhm({ refetchOnMount: false });

  const treasuryBalance: number | undefined = useAppSelector(state => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      tokenBalances += ethTreasury && ethTreasury[0].sOHMBalanceUSD;
      return tokenBalances;
    }
  });

  return (
    <div id="choose-bond-view">
      <ClaimBonds />
      <BondContainer>
        <Zoom in={true}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className="ohm-card full-width">
                <Box className="card-header">
                  <Typography variant="h5" data-testid="t">
                    <Trans>Bond</Trans> (1,1)
                  </Typography>
                </Box>

                <Grid container item xs={12} style={{ margin: "10px 0px 20px" }} className="bond-hero">
                  <Grid item xs={6}>
                    <Box textAlign={`${isVerySmallScreen ? "left" : "center"}`}>
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Treasury Balance</Trans>
                      </Typography>
                      <Box>
                        {isAppLoading ? (
                          <Skeleton width="180px" data-testid="treasury-balance-loading" />
                        ) : (
                          <Typography variant="h4" data-testid="treasury-balance">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            }).format(Number(treasuryBalance))}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={6} className={`ohm-price`}>
                    <Box textAlign={`${isVerySmallScreen ? "right" : "center"}`}>
                      <Typography variant="h5" color="textSecondary">
                        <Trans>WEN Price</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {isAppLoading ? <Skeleton width="100px" /> : formatCurrency(Number(marketPrice), 2)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {!isSmallScreen && (
                  <Grid container item>
                    <TableContainer>
                      <Table aria-label="Available bonds">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">
                              <Trans>Bond</Trans>
                            </TableCell>
                            <TableCell align="left">
                              <Trans>Price</Trans>
                            </TableCell>
                            <TableCell align="left">
                              <Trans>ROI</Trans>
                            </TableCell>
                            <TableCell align="right">
                              <Trans>Purchased</Trans>
                            </TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {bonds.map(bond => (
                            <BondTableData key={bond.name} bond={bond} />
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
              </Paper>
            </Grid>

            {isSmallScreen && (
              <Box className="ohm-card-container" marginY="8px" width="100%">
                <Grid container item spacing={3}>
                  {bonds.map(bond => (
                    <Grid item xs={12} key={bond.name}>
                      <BondDataCard key={bond.name} bond={bond} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card full-width">
                <OhmMintedGraph />
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card full-width">
                <OhmMintedPerTotalSupplyGraph />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className="ohm-card full-width">
                <DebtRatioGraph />
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </BondContainer>
    </div>
  );
}

const BondContainer = styled.div`
  max-width: 833px;
  width: 100%;
  padding: 24px 0px;
`;

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <ChooseBond />
  </QueryClientProvider>
);
