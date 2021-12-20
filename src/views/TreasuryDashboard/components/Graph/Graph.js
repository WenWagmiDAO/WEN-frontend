import Chart from "src/components/Chart/Chart.jsx";
import { useTheme } from "@material-ui/core/styles";
import { trim, formatCurrency } from "../../../../helpers";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { useTreasuryRebases } from "../../hooks/useTreasuryRebases";
import { useDebtMetrics } from "../../hooks/useDebtMetrics";
import { bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData";
import { EPOCH_INTERVAL, OHM_TICKER } from "../../../../constants";
import { useTreasuryOhm } from "../../hooks/useTreasuryOhm";
import { parse } from "date-fns";

export const Graph = ({ children }) => <>{children}</>;

export const TotalValueDepositedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      type="area"
      data={data}
      itemType={itemType.dollar}
      itemNames={tooltipItems.tvl}
      dataKey={["totalValueLocked"]}
      headerText="Total Value Deposited"
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.tvl}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
    />
  );
};

export const MarketValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  let { data: ethData } = useTreasuryOhm({ refetchOnMount: false });

  const datalength = data && data.length;
  const ethDatalength = ethData && ethData.length;

  for (let i = 0; i < datalength - ethDatalength; i++) {
    ethData && ethData.push({ sOHMBalanceUSD: 0 });
  }

  const stats =
    ethData &&
    data &&
    data.map((e, i) => {
    const gOhmPrice = ethData[i].gOhmPrice ? ethData[i].gOhmPrice : 0;
    const gOhmBalance = e.treasuryGOhmBalance ? e.treasuryGOhmBalance : 0;
    const sOHMBalanceUSD = ethData[i].sOHMBalanceUSD + (gOhmBalance * gOhmPrice)
    return {
      timestamp: e.id,
      ...e,
      sOHMBalanceUSD,
    }
  })

  return (
    <Chart
      type="stack"
      data={stats}
      dataKey={["treasuryDaiMarketValue", "treasuryWETHMarketValue", "sOHMBalanceUSD"]}
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#DC30EB", "#EA98F1"],
        ["#8BFF4D", "#4C8C2A"],
        ["#ff758f", "#c9184a"],
      ]}
      headerText="Market Value of Treasury Assets"
      headerSubText={`${ethData && data && formatCurrency(data[0].treasuryMarketValue + ethData[0].sOHMBalanceUSD)}`}
      bulletpointColors={bulletpoints.coin}
      itemNames={tooltipItems.coin}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.mvt}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const RiskFreeValueGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      type="stack"
      data={data}
      format="currency"
      dataKey={["treasuryDaiRiskFreeValue"]}
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#ff758f", "#c9184a"],
        ["#000", "#fff"],
        ["#000", "#fff"],
      ]}
      headerText="Risk Free Value of Treasury Assets"
      headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
      bulletpointColors={bulletpoints.rfv}
      itemNames={tooltipItems.rfv}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.rfv}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const ProtocolOwnedLiquidityGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <Chart
      isPOL
      type="area"
      data={data}
      dataFormat="percent"
      itemNames={tooltipItems.pol}
      itemType={itemType.percentage}
      dataKey={["treasuryOhmDaiPOL"]}
      bulletpointColors={bulletpoints.pol}
      infoTooltipMessage={tooltipInfoMessages.pol}
      headerText="Protocol Owned Liquidity WEN-DAI"
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
      stopColor={[["rgba(128, 204, 131, 1)", "rgba(128, 204, 131, 0)"]]}
    />
  );
};

export const OHMStakedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const staked =
    data &&
    data
      .map(metric => ({
        staked: (metric.sOhmCirculatingSupply / metric.ohmCirculatingSupply) * 100,
        timestamp: metric.timestamp,
      }))
      .filter(metric => metric.staked < 100);

  return (
    <Chart
      isStaked
      type="area"
      data={staked}
      dataKey={["staked"]}
      dataFormat="percent"
      headerText={`${OHM_TICKER} staked`}
      stopColor={[["#55EBC7", "#47ACEB"]]}
      bulletpointColors={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
    />
  );
};

export const APYOverTimeGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryRebases({ refetchOnMount: false });

  const apy =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
    }));

  return (
    <Chart
      type="line"
      scale="log"
      data={apy}
      dataKey={["apy"]}
      dataFormat="percent"
      headerText="APY over time"
      itemNames={tooltipItems.apy}
      itemType={itemType.percentage}
      color={theme.palette.text.primary}
      bulletpointColors={bulletpoints.apy}
      stroke={[theme.palette.text.primary]}
      infoTooltipMessage={tooltipInfoMessages.apy}
      headerSubText={`${apy && apy[0].apy.toLocaleString("en-us")}%`}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const RunwayAvailableGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const runway =
    data && 
    data.map(entry => {
      const epochLengthSeconds = EPOCH_INTERVAL * 0.9;
      return {
        timestamp: entry.timestamp,
        runwayCurrent: (entry.runwayCurrent * 3 * epochLengthSeconds) / 86400, //86400 is number of seconds in a day.
        runway7dot5k: (entry.runway7dot5k * 3 * epochLengthSeconds) / 86400,
      }
    })

  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);

  return (
    <Chart
      type="multi"
      data={runway}
      dataKey={["runwayCurrent", "runway7dot5k"]}
      color={theme.palette.text.primary}
      stroke={colors}
      headerText="Runway Available"
      headerSubText={`${runway && trim(runway[0].runwayCurrent, 1)} Days`}
      dataFormat="days"
      bulletpointColors={runwayBulletpoints}
      itemNames={tooltipItems.runway}
      itemType={""}
      infoTooltipMessage={tooltipInfoMessages.runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const DilutionGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const dilution =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      percentage: (entry.index / (entry.ohmCirculatingSupply / 2000)) * 100, //initial total supply of 2000
      index: entry.index
    }));

  return (
    <Chart
      type="composed"
      data={dilution}
      dataKey={["percentage", "index"]}
      stopColor={[["#F5AC37", "#EA9276"]]}
      stroke={"#38caff"}
      headerText="Dilution Over Time"
      headerSubText={`${dilution && trim(dilution[0].percentage, 2)}%`}
      bulletpointColors={bulletpoints.dilution}
      itemNames={tooltipItems.dilution}
      itemType={[itemType.percentage, "sWEN"]}
      infoTooltipMessage={tooltipInfoMessages.dilution}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const OhmMintedGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const minted =
    data &&
    data
      .map(entry => ({
        timestamp: entry.timestamp,
        ohmMinted: entry.ohmMinted,
      }))
      .slice(0, data.length - 1);

  const fiveDaySlice = minted && minted.slice(0, 5);
  //react-query is so weird why won't it let me use .reduce() T_T
  let fiveDayTotal = 0;
  for (let i = 0; i < 5; i++) {
    console.log("pls work");
    //fiveDayTotal += fiveDaySlice && fiveDaySlice[i].ohmMinted;
  }
  return (
    <Chart
      type="area"
      dataFormat="OHM"
      data={minted}
      dataKey={["ohmMinted"]}
      itemNames={tooltipItems.minted}
      itemType={itemType.OHM}
      headerText={`${OHM_TICKER} minted`}
      stopColor={[["#55EBC7", "#47ACEB"]]}
      bulletpointColors={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.minted}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${(fiveDayTotal && fiveDayTotal / 5).toFixed(2)} WEN`}
      todayMessage="5-day Average"
    />
  );
};

export const OhmMintedPerTotalSupplyGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const minted =
    data &&
    data
      .map(entry => ({
        timestamp: entry.timestamp,
        percentage: (entry.ohmMinted / entry.totalSupply) * 100,
      }))
      .slice(0, data.length - 1);
  const fiveDaySlice = minted && minted.slice(0, 5);
  let fiveDayTotal = 0;
  for (let i = 0; i < 5; i++) {
    console.log("wagmi mfkers");
    //fiveDayTotal += fiveDaySlice && fiveDaySlice[i].percentage;
  }
  return (
    <Chart
      type="area"
      dataFormat="percent"
      data={minted}
      dataKey={["percentage"]}
      itemNames={tooltipItems.mcs}
      itemType={itemType.percentage}
      headerText={`${OHM_TICKER} Minted/Total Supply`}
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.mcs}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${(fiveDayTotal && fiveDayTotal / 5).toFixed(2)}%`}
      todayMessage="5-day Average"
    />
  );
};

export const DebtRatioGraph = () => {
  const theme = useTheme();
  const { data } = useDebtMetrics({ refetchOnMount: false });

  const debtRatios =
    data &&
    data.map(entry => ({
      timestamp: entry.timestamp,
      daiDebtRatio: entry.dai_debt_ratio / 1e10,
      ethDebtRatio: entry.eth_debt_ratio / 1e10,
      ohmDaiDebtRatio: entry.ohmdai_debt_ratio / 1e19,
    }));
  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);

  return (
    <Chart
      type="multi"
      data={debtRatios}
      dataKey={["daiDebtRatio", "ethDebtRatio", "ohmDaiDebtRatio"]}
      color={theme.palette.text.primary}
      stroke={colors}
      headerText="Debt Ratios"
      headerSubText={`Total ${
          debtRatios && trim(debtRatios[0].daiDebtRatio + debtRatios[0].ethDebtRatio + debtRatios[0].ohmDaiDebtRatio, 2)
        }%`}
      dataFormat="percent"
      bulletpointColors={runwayBulletpoints}
      itemNames={tooltipItems.debtratio}
      itemType={itemType.percentage}
      infoTooltipMessage={tooltipInfoMessages.debtratio}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      isDebt={true}
    />
  );
};
