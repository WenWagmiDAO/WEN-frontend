import { useSelector } from "react-redux";
import { Paper, Grid, Typography, Box, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { t, Trans } from "@lingui/macro";

function Dashboard() {
  // Use marketPrice as indicator of loading.
  const isAppLoading = useSelector(state => !state.app?.marketPrice ?? true);
  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });

  return (
    <div id="dashboard-view">
      <Grid container spacing={1} className="top-row-data">
        <Grid item lg={4} md={4} sm={3} xs={5} className="olympus-card">
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">
                <Trans>Price</Trans>
              </Typography>
              <Typography variant="h5">
                {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item lg={4} md={4} sm={4} xs={7}>
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">
                <Trans>Market Cap</Trans>
              </Typography>
              <Typography variant="h5">
                {isAppLoading ? (
                  <Skeleton width="160px" />
                ) : (
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(marketCap)
                )}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>

        <Grid item lg={4} md={4} sm={5} xs={12}>
          <Zoom in={true}>
            <Paper className="ohm-card">
              <Typography variant="h6">
                <Trans>Supply (circulating/total)</Trans>
              </Typography>
              <Typography variant="h5">
                {isAppLoading ? (
                  <Skeleton width="250px" />
                ) : (
                  `${new Intl.NumberFormat("en-US", {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  }).format(circSupply)}
                    /
                    ${new Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(totalSupply)}`
                )}
              </Typography>
            </Paper>
          </Zoom>
        </Grid>
      </Grid>
      <Box className="main-data-area">
        <Grid container spacing={2} className="data-grid">
          <Grid item lg={4} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={4} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={6} sm={12}>
            <div className="dune-card"></div>
          </Grid>

          <Grid item lg={6} sm={12}>
            <div className="dune-card"></div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default Dashboard;
