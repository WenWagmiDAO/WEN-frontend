import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Select,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  SvgIcon,
  makeStyles,
} from "@material-ui/core";
import TabPanel from "../../components/TabPanel";
import InfoTooltip from "../../components/InfoTooltip/InfoTooltip.jsx";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import BeetsLogo from "../../assets/images/beets-icon-large.png";
import wsWENLogo from "../../assets/images/wsexod-icon.png";
import { getOhmTokenImage, getTokenImage, trim, formatCurrency } from "../../helpers";
import { Trans } from "@lingui/macro";
import { changeApproval, changeWrap } from "../../slices/WrapThunk";
import "../Stake/stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn } from "src/slices/PendingTxnsSlice";
import TxnButtonText from "src/components/TxnButtonText";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sohm");
const ohmImg = getOhmTokenImage(16, 16);

const useStyles = makeStyles(theme => ({
  textHighlight: {
    color: theme.palette.highlight,
  },
}));

function Wrap() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [asset, setAsset] = useState("sWEN");

  const classes = useStyles();

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });

  const sOhmPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const wsOhmPrice = useSelector(state => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const ohmWrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.ohmWrap;
  });
  const sohmWrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.sohmWrap;
  });
  const unwrapAllowance = useSelector(state => {
    return state.account.wrapping && state.account.wrapping.ohmUnwrap;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      asset === "sWEN" ? setQuantity(sohmBalance) : setQuantity(ohmBalance);
    } else {
      setQuantity(wsohmBalance);
    }
  };

  const changeAssetFrom = event => {
    setQuantity("");
    setAsset(event.target.value);
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token: asset, provider, networkID: chainID }));
  };

  const onChangeWrap = async action => {
    let finalAction;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || Number(quantity) === 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    if (action === "wrap") {
      if (asset === "sWEN") {
        if (ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(sohmBalance, "gwei")))
          return dispatch(error("You cannot wrap more than your sWEN balance."));
      } else {
        if (ethers.utils.parseUnits(quantity, "gwei").gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
          return dispatch(error("You cannot wrap more than your WEN balance."));
        }
      }
    }

    if (
      action === "unwrap" &&
      ethers.utils.parseUnits(quantity, "ether").gt(ethers.utils.parseUnits(wsohmBalance, "ether"))
    ) {
      return dispatch(error("You cannot unwrap more than your wsWEN balance."));
    }

    if (action === "wrap") finalAction = asset === "sWEN" ? "wrapFromsOHM" : "wrapFromOHM";
    if (action === "unwrap") finalAction = asset === "sWEN" ? "unwrapTosOHM" : "unwrapToOHM";

    await dispatch(
      changeWrap({ address, action: finalAction, value: quantity.toString(), provider, networkID: chainID }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return ohmWrapAllowance > 0;
      if (token === "sohm") return sohmWrapAllowance > 0;
      if (token === "wsohm") return unwrapAllowance > 0;
      return 0;
    },
    [ohmWrapAllowance, sohmWrapAllowance, unwrapAllowance],
  );

  const isAllowanceDataLoading =
    (ohmWrapAllowance == null && view === 0) ||
    (sohmWrapAllowance == null && view === 0) ||
    (unwrapAllowance == null && view === 1);

  const isUnwrap = view === 1;
  const convertedQuantity = isUnwrap ? (quantity * wsOhmPrice) / sOhmPrice : (quantity * sOhmPrice) / wsOhmPrice;

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <>
          <Paper className={`ohm-card`}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <div className="card-header">
                  <Typography variant="h5">Wrap / Unwrap</Typography>
                  <Link
                    className="migrate-sohm-button"
                    style={{ textDecoration: "none" }}
                    href="https://ftmscan.com/address/0xe992C5Abddb05d86095B18a158251834D616f0D1"
                    aria-label="wsohm-wut"
                    target="_blank"
                  >
                    <Typography>wsWEN</Typography> <SvgIcon component={InfoIcon} color="primary" />
                  </Link>
                </div>
              </Grid>

              <Grid item>
                <div className="stake-top-metrics">
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="wrap-sOHM">
                        <Typography variant="h5" color="textSecondary">
                          sWEN Price
                        </Typography>
                        <Typography variant="h4">
                          {sOhmPrice ? formatCurrency(sOhmPrice, 2) : <Skeleton width="150px" />}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="wrap-index">
                        <Typography variant="h5" color="textSecondary">
                          Current Index
                        </Typography>
                        <Typography variant="h4">
                          {currentIndex ? <>{trim(currentIndex, 2)} WEN</> : <Skeleton width="150px" />}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4} lg={4}>
                      <div className="wrap-wsOHM">
                        <Typography variant="h5" color="textSecondary">
                          wsWEN Price
                          <InfoTooltip
                            message={
                              "wsWEN = sWEN * index\n\nThe price of wsWEN is equal to the price of WEN multiplied by the current index"
                            }
                          />
                        </Typography>
                        <Typography variant="h4">
                          {wsOhmPrice ? formatCurrency(wsOhmPrice, 2) : <Skeleton width="150px" />}
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
                    <Typography variant="h6">Connect your wallet to wrap sWEN</Typography>
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
                      >
                        <Tab label="Wrap" {...a11yProps(0)} />
                        <Tab label="Unwrap" {...a11yProps(1)} />
                      </Tabs>
                      <Box
                        className="select-wrap-asset "
                        display="flex"
                        alignItems="center"
                        style={{ paddingBottom: 0 }}
                      >
                        <Typography>
                          <span className="asset-select-label">{view === 0 ? "Wrap from " : "Unwrap to"}</span>
                        </Typography>
                        <FormControl
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            margin: "0 10px",
                            height: "33px",
                            minWidth: "69px",
                          }}
                        >
                          <Select
                            id="asset-select"
                            value={asset}
                            label="Asset"
                            onChange={changeAssetFrom}
                            disableUnderline
                          >
                            <MenuItem value={"WEN"}>WEN</MenuItem>
                            <MenuItem value={"sWEN"}>sWEN</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box
                        className="stake-action-row "
                        display="flex"
                        alignItems="center"
                        style={{ paddingBottom: 0 }}
                      >
                        {address && !isAllowanceDataLoading ? (
                          !hasAllowance(asset === "sWEN" ? "sohm" : "ohm") && view === 0 ? (
                            <Box className="help-text">
                              <Typography variant="body1" className="stake-note" color="textSecondary">
                                {view === 0 && (
                                  <>
                                    First time wrapping <b>{asset}</b>?
                                    <br />
                                    Please approve WagmiWen to use your <b>{asset}</b> for wrapping.
                                  </>
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <FormControl className="ohm-input" variant="outlined" color="primary">
                              <OutlinedInput
                                id="amount-input"
                                type="number"
                                placeholder="Enter an amount"
                                className="stake-input"
                                value={quantity}
                                onChange={e => setQuantity(e.target.value)}
                                labelWidth={0}
                                autoFocus
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
                          {address && hasAllowance(asset === "sWEN" ? "sohm" : "ohm") ? (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "wrapping") || !quantity}
                              onClick={() => {
                                onChangeWrap("wrap");
                              }}
                            >
                              <TxnButtonText
                                pendingTransactions={pendingTransactions}
                                type="wrapping"
                                defaultText={<Trans>Wrap {asset}</Trans>}
                              />
                            </Button>
                          ) : (
                            <Button
                              className="stake-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "approve_wrapping")}
                              onClick={() => {
                                onSeekApproval("sohm");
                              }}
                            >
                              <TxnButtonText
                                pendingTransactions={pendingTransactions}
                                type="approve_wrapping"
                                defaultText={<Trans>Approve</Trans>}
                              />
                            </Button>
                          )}
                        </TabPanel>

                        <TabPanel value={view} index={1} className="stake-tab-panel">
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unwrapping") || !quantity}
                            onClick={() => {
                              onChangeWrap("unwrap");
                            }}
                          >
                            <TxnButtonText
                              pendingTransactions={pendingTransactions}
                              type="unwrapping"
                              defaultText={<Trans>Unwrap {asset}</Trans>}
                            />
                          </Button>
                        </TabPanel>
                      </Box>

                      {quantity && (
                        <Box padding={1}>
                          <Typography variant="body2" className={classes.textHighlight}>
                            {isUnwrap
                              ? `Unwrapping ${quantity} wsWEN will result in ${trim(convertedQuantity, 4)} ${asset}`
                              : `Wrapping ${quantity} ${asset} will result in ${trim(convertedQuantity, 4)} wsWEN`}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <div className={`stake-user-data wrap-user-data`}>
                      <div className="data-row">
                        <Typography variant="body1">Wrappable Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? (
                            <Skeleton width="80px" />
                          ) : (
                            <>
                              {asset === "sWEN" ? <>{trim(sohmBalance, 4)} sWEN</> : <>{trim(ohmBalance, 4)} WEN</>}
                            </>
                          )}
                        </Typography>
                      </div>
                      <div className="data-row">
                        <Typography variant="body1">Unwrappable Balance</Typography>
                        <Typography variant="body1">
                          {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsohmBalance, 4)} wsWEN</>}
                        </Typography>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Grid>
          </Paper>

          {/* <Paper className={`ohm-card`}>
            <div className="card-header">
              <Typography variant="h5">Farm Pool</Typography>
            </div>
            <WrapFarm>
              <FarmPair>
                <img src={wsWENLogo} alt="wsWEN logo" />
                <img src={BeetsLogo} alt="Beethovenx logo" />
                <Pair>wsWEN-BEETS</Pair>
              </FarmPair>
              <Button
                variant="outlined"
                href="https://app.beets.fi/#/pools"
                target="_blank"
                className="stake-lp-button"
              >
                <Typography variant="h6">
                  <Trans>Stake on Beethoven-x</Trans>
                </Typography>
                <SvgIcon component={ArrowUp} color="primary" />
              </Button>
            </WrapFarm>
          </Paper> */}
        </>
      </Zoom>
    </div>
  );
}

export default Wrap;

const WrapFarm = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 24px;

  .MuiButton-outlined {
    width: 50%;
    h6 {
      padding-right: 12px;
    }
  }
`;

const FarmPair = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 36px;
    height: 36px;
  }
`;

const Pair = styled.div`
  padding-left: 18px;
  font-size: 1.1rem;
`;
