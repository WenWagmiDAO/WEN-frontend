import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import styled from "styled-components";
import { t, Trans } from "@lingui/macro";
import NewReleases from "@material-ui/icons/NewReleases";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getOhmTokenImage, getTokenImage, trim } from "../../helpers";
import { changeApproval, changeStake } from "../../slices/StakeThunk";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import TxnButtonText from "src/components/TxnButtonText";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { OHM_TICKER, sOHM_TICKER } from "../../constants";
import { useAppSelector } from "src/hooks";
import PersonalExodChart from "../../components/Chart/PersonalExodChart";
import StakeRow from "./StakeRow";
import { ExpandMore } from "@material-ui/icons";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

function Stake() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const marketPrice = useAppSelector(state => state.app.marketPrice || 0);
  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useAppSelector(state => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const wsohmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohmAsSohm;
  });
  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });
  const stakingRebase = useAppSelector(state => {
    return state.app.stakingRebase || 0;
  });
  const stakingAPY = useAppSelector(state => {
    return state.app.stakingAPY || 0;
  });
  const stakingTVL = useAppSelector(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(Number(ohmBalance));
    } else {
      setQuantity(Number(sohmBalance));
    }
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot stake more than your ${OHM_TICKER} balance.`));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
      return dispatch(error(t`You cannot unstake more than your ${sOHM_TICKER} balance.`));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkID: chainID }));
    setQuantity(0);
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance, wsohmAsSohm]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const stakedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(marketPrice * trimmedBalance);
  const sohmValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(marketPrice * Number(sohmBalance));
  const wsohmValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(marketPrice * Number(wsohmAsSohm));

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * trimmedBalance, 4);

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">Single Stake (3, 3)</Typography>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>APY</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingAPY ? (
                          <span data-testid="apy-value">
                            {new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="apy-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Total Value Deposited</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {stakingTVL ? (
                          <span data-testid="tvl-value">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                              minimumFractionDigits: 0,
                            }).format(stakingTVL)}
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="tvl-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-index">
                      <Typography variant="h5" color="textSecondary">
                        <Trans>Current Index</Trans>
                      </Typography>
                      <Typography variant="h4">
                        {currentIndex ? (
                          <span data-testid="index-value">
                            {trim(Number(currentIndex), 2)} {sOHM_TICKER}
                          </span>
                        ) : (
                          <Skeleton width="150px" data-testid="index-loading" />
                        )}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake WEN</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
                    >
                      <Tab
                        label={t({
                          id: "Stake",
                          comment: "The action of staking (verb)",
                        })}
                        {...a11yProps(0)}
                      />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>
                    <Box className="stake-action-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("ohm") && view === 0) || (!hasAllowance("sohm") && view === 1) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  <Trans>First time staking</Trans> <b>{OHM_TICKER}</b>?
                                  <br />
                                  <Trans>Please approve WagmiWen to use your</Trans> <b>{OHM_TICKER}</b>{" "}
                                  <Trans>for staking</Trans>.
                                </>
                              ) : (
                                <>
                                  <Trans>First time unstaking</Trans> <b>{sOHM_TICKER}</b>?
                                  <br />
                                  <Trans>Please approve WagmiWen to use your</Trans> <b>{sOHM_TICKER}</b>{" "}
                                  <Trans>for unstaking</Trans>.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="ohm-input" variant="outlined" color="primary">
                            <InputLabel htmlFor="amount-input"></InputLabel>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              onChange={e => setQuantity(Number(e.target.value))}
                              labelWidth={0}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} color="inherit">
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("ohm") ? (
                          <Box p={"10px"}>
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "staking")}
                              onClick={() => {
                                onChangeStake("stake");
                              }}
                            >
                              <TxnButtonText
                                pendingTransactions={pendingTransactions}
                                type="staking"
                                defaultText={<Trans>Stake WEN</Trans>}
                              />
                            </Button>
                          </Box>
                        ) : (
                          <Box p={"10px"}>
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                              onClick={() => {
                                onSeekApproval("ohm");
                              }}
                            >
                              <TxnButtonText
                                pendingTransactions={pendingTransactions}
                                type="approve_staking"
                                defaultText={<Trans>Approve</Trans>}
                              />
                            </Button>
                          </Box>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("sohm") ? (
                          <Box p={"10px"}>
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "unstaking")}
                              onClick={() => {
                                onChangeStake("unstake");
                              }}
                            >
                              <TxnButtonText
                                pendingTransactions={pendingTransactions}
                                type="unstaking"
                                defaultText={<Trans>Unstake {OHM_TICKER}</Trans>}
                              />
                            </Button>
                          </Box>
                        ) : (
                          <Box p={"10px"}>
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                              onClick={() => {
                                onSeekApproval("sohm");
                              }}
                            >
                              <TxnButtonText
                                pendingTransactions={pendingTransactions}
                                type="approve_unstaking"
                                defaultText={<Trans>Approve</Trans>}
                              />
                            </Button>
                          </Box>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>

                  <div className={`stake-user-data`}>
                    <StakeRow
                      title={t`Unstaked Balance`}
                      id="user-balance"
                      balance={`${trim(Number(ohmBalance), 4)} WEN`}
                      {...{ isAppLoading }}
                    />
                    <Accordion className="stake-accordion" square>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <StakeRow
                          title={t`Staked Balance`}
                          id="user-staked-balance"
                          balance={`${trimmedBalance} sWEN`}
                          {...{ isAppLoading }}
                        />
                      </AccordionSummary>
                      <AccordionDetails>
                        <StakeRow
                          title={t`Single Staking`}
                          balance={`${trim(Number(sohmBalance), 4)} sWEN`}
                          indented
                          {...{ isAppLoading }}
                        />
                        {/* <StakeRow
                          title={`${t`Wrapped Balance`}`}
                          balance={`${trim(Number(gOhmBalance), 4)} gOHM`}
                          indented
                          {...{ isAppLoading }}
                        /> */}
                        {/* <StakeRow
                          title={t`Single Staking (v1)`}
                          balance={`${trim(Number(sohmV1Balance), 4)} sOHM (v1)`}
                          indented
                          {...{ isAppLoading }}
                        /> */}
                        <StakeRow
                          title={t`Wrapped Balance`}
                          balance={`${trim(Number(wsohmBalance), 4)} wsWEN`}
                          {...{ isAppLoading }}
                          indented
                        />
                        {/* <StakeRow
                          title={t`Wrapped Balance in FiatDAO`}
                          balance={`${trim(Number(fiatDaowsohmBalance), 4)} wsOHM (v1)`}
                          {...{ isAppLoading }}
                          indented
                        />
                        <StakeRow
                          title={t`Staked Balance in Fuse`}
                          balance={`${trim(Number(fsohmBalance), 4)} fsOHM (v1)`}
                          indented
                          {...{ isAppLoading }}
                        /> */}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion className="stake-accordion staked-value" square>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <StakeRow title={t`Staked Balance Value ($)`} balance={stakedValue} {...{ isAppLoading }} />
                      </AccordionSummary>
                      <AccordionDetails>
                        <StakeRow
                          title={t`Single Staking Value ($)`}
                          balance={sohmValue}
                          indented
                          {...{ isAppLoading }}
                        />
                        <StakeRow
                          title={t`Wrapped Balance Value ($)`}
                          balance={wsohmValue}
                          indented
                          {...{ isAppLoading }}
                        />
                      </AccordionDetails>
                    </Accordion>
                    <Divider color="secondary" />

                    <StakeRow
                      title={t`Next Reward Amount`}
                      balance={`${nextRewardValue} sWEN`}
                      {...{ isAppLoading }}
                    />
                    <StakeRow
                      title={t`Next Reward Yield`}
                      balance={`${stakingRebasePercentage}%`}
                      {...{ isAppLoading }}
                    />
                    <StakeRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate) * 100, 4)}%`}
                      {...{ isAppLoading }}
                    />
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
      <ChartContainer>
        <Zoom in={true}>
          <Paper className="ohm-card">
            <PersonalExodChart
              calcDays={90}
              exodAmount={(trimmedBalance || 0) + (quantity || Number(ohmBalance) || 0)}
              rebaseRate={stakingRebase * 100}
              finalExodPrice={marketPrice}
              exodPrice={marketPrice}
              stakingView
            />
          </Paper>
        </Zoom>
      </ChartContainer>
    </div>
  );
}

export default Stake;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
`;
