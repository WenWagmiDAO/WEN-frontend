import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
  Zoom,
  Slider,
} from "@material-ui/core";
import { QueryClient, QueryClientProvider } from "react-query";
import { Trans, t } from "@lingui/macro";
import { useAppSelector } from "src/hooks";
import styled from "styled-components";
import CalcHeader from "./CalcHeader";
import ImportantValues from "./ImportantValues";
import EstimatedValues from "./EstimatedValues";
import PriceMultiplier from "./PriceMultiplier";
import PersonalExodChart from "src/components/Chart/PersonalExodChart";
import {
  calcInitialInvestment,
  calcMinimumDays,
  calcMinimumPrice,
  calcProfits,
  calcRoi,
  calcTotalReturns,
  calcYieldPercent,
  calcTotalExod,
} from "./formulas";
import { useTreasuryMetrics } from "../TreasuryDashboard/hooks/useTreasuryMetrics";
import { EPOCH_INTERVAL } from "src/constants";

function Calc() {
  const [exodAmountInput, setExodAmountInput] = useState(1);
  const [rebaseRateInput, setRebaseRateInput] = useState(0);
  const [exodPriceInput, setExodPriceInput] = useState(0);
  const [finalExodPriceInput, setFinalExodPriceInput] = useState(0);
  const [calcDays, setCalcDays] = useState(90);
  const [yieldPercent, setYieldPercent] = useState(0);
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [totalReturns, setTotalReturns] = useState(0);
  const [minimumDays, setMinimumDays] = useState(0);
  const [minimumPrice, setMinimumPrice] = useState(0);

  const isAppLoading = useAppSelector(state => state.app.loading);
  const marketPrice = useAppSelector(state => state.app.marketPrice || 0);
  const blockRateSeconds = useAppSelector(state => state.app.blockRateSeconds || 0);
  const stakingRebase = useAppSelector(state => state.app.stakingRebase || 0);
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const wsohmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohmAsSohm;
  });
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const runway = data && data.filter((metric: any) => metric.runway10k > 5);
  const currentRunway = runway && (runway[0].runwayCurrent * 3 * EPOCH_INTERVAL * blockRateSeconds) / 86400;

  const trimmedBalance = Number(
    [sohmBalance, wsohmAsSohm]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );

  useEffect(() => {
    trimmedBalance && setExodAmountInput(trimmedBalance);
  }, [trimmedBalance]);

  useEffect(() => {
    setRebaseRateInput(stakingRebase * 100);
  }, [stakingRebase]);

  useEffect(() => {
    if (marketPrice) {
      setFinalExodPriceInput(marketPrice);
      setExodPriceInput(marketPrice);
    }
  }, [marketPrice]);

  useEffect(() => {
    setYieldPercent(calcYieldPercent(rebaseRateInput, calcDays, blockRateSeconds));
  }, [rebaseRateInput, calcDays]);

  useEffect(() => {
    setInitialInvestment(calcInitialInvestment(exodAmountInput, exodPriceInput));
  }, [exodAmountInput, exodPriceInput]);

  useEffect(() => {
    setTotalReturns(calcTotalReturns(exodAmountInput, finalExodPriceInput, yieldPercent));
  }, [exodAmountInput, finalExodPriceInput, yieldPercent]);

  useEffect(() => {
    setMinimumDays(
      calcMinimumDays(initialInvestment, exodAmountInput, finalExodPriceInput, rebaseRateInput, blockRateSeconds),
    );
  }, [initialInvestment, exodAmountInput, finalExodPriceInput, rebaseRateInput]);

  useEffect(() => {
    setMinimumPrice(calcMinimumPrice(initialInvestment, rebaseRateInput, calcDays, exodAmountInput, blockRateSeconds));
  }, [initialInvestment, rebaseRateInput, calcDays, exodAmountInput]);

  return (
    <>
      <CalcContainer id="stake-view">
        <Zoom in={true}>
          <Paper className="ohm-card">
            <Grid container direction="column" spacing={2}>
              <CalcHeader />
              <ImportantValues {...{ marketPrice, stakingRebase, isAppLoading, trimmedBalance }} />
              <CalcArea>
                <FieldInput
                  field={t`sWEN Amount`}
                  value={exodAmountInput}
                  max={<Trans>Max</Trans>}
                  onChange={setExodAmountInput}
                  onMax={() => setExodAmountInput(trimmedBalance)}
                />
                <FieldInput
                  field={t`Rebase rate`}
                  value={Number(rebaseRateInput.toFixed(4))}
                  max={<Trans>Current</Trans>}
                  onChange={setRebaseRateInput}
                  onMax={() => setRebaseRateInput(stakingRebase * 100)}
                />
                <FieldInput
                  field={t`WEN price at purchase ($)`}
                  value={Number(exodPriceInput.toFixed(2))}
                  max={<Trans>Current</Trans>}
                  onChange={setExodPriceInput}
                  onMax={() => setExodPriceInput(marketPrice)}
                />

                <FieldInput
                  field={t`Future WEN market price ($)`}
                  value={Number(finalExodPriceInput.toFixed(2))}
                  max={<Trans>Current</Trans>}
                  onChange={setFinalExodPriceInput}
                  onMax={() => setFinalExodPriceInput(marketPrice)}
                />
              </CalcArea>
              <SliderArea>
                <CalcRow>
                  <SliderContainer>
                    <SliderHeader
                      currentRunway={currentRunway}
                      calcDays={calcDays}
                      onClick={() => setCalcDays(Math.floor(Number(currentRunway)))}
                    />
                    <Slider
                      aria-label="Days"
                      max={365}
                      value={calcDays}
                      color="primary"
                      onChange={(_e, newValue) => setCalcDays(Number(newValue))}
                    />
                  </SliderContainer>
                </CalcRow>
                <CalcRow>
                  <PriceMultiplier currentPrice={marketPrice} setFinalExodPriceInput={setFinalExodPriceInput} />
                </CalcRow>
              </SliderArea>
              <EstimatedValues
                initialInvestment={initialInvestment}
                estimatedROI={calcRoi(totalReturns, initialInvestment)}
                totalSExod={calcTotalExod(exodAmountInput, yieldPercent)}
                estimatedProfits={calcProfits(totalReturns, initialInvestment)}
                breakEvenDays={minimumDays}
                minimumPrice={minimumPrice}
                totalReturns={totalReturns}
              />
              <YugiQuote>
                <Typography variant="subtitle2">
                  <Trans>My grandpa's deck has no pathetic cards, Kaiba</Trans> 🃏
                </Typography>
              </YugiQuote>
            </Grid>
          </Paper>
        </Zoom>
      </CalcContainer>
      <CalcContainer>
        <Zoom in={true}>
          <Paper className="ohm-card">
            <PersonalExodChart
              calcDays={calcDays}
              exodAmount={exodAmountInput}
              rebaseRate={rebaseRateInput}
              finalExodPrice={finalExodPriceInput}
              exodPrice={exodPriceInput}
              stakingView={false}
            />
          </Paper>
        </Zoom>
      </CalcContainer>
    </>
  );
}

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <Calc />
  </QueryClientProvider>
);

type FieldInputProps = {
  field: any;
  value: number;
  onChange: (value: number) => void;
  max: any;
  onMax: (value: any) => void;
};

const FieldInput = ({ field, value, onChange, max, onMax }: FieldInputProps) => {
  return (
    <CalcRow>
      <Typography variant="h6" color="textSecondary">
        {field}
      </Typography>
      <FormControl variant="outlined" color="primary">
        <InputLabel htmlFor="amount-input"></InputLabel>
        <OutlinedInput
          type="number"
          placeholder={`${t`Enter`} ${field}`}
          value={value || null}
          onChange={e => onChange(Number(e.target.value))}
          labelWidth={0}
          endAdornment={
            <InputAdornment position="end">
              <Button variant="text" onClick={onMax} color="inherit">
                {max}
              </Button>
            </InputAdornment>
          }
        />
      </FormControl>
    </CalcRow>
  );
};

const SliderHeader = ({
  currentRunway,
  calcDays,
  onClick,
}: {
  currentRunway: number;
  calcDays: number;
  onClick: () => void;
}) => {
  return (
    <SliderHeaderContainer onClick={!!currentRunway ? onClick : undefined} runwayLoaded={!!currentRunway}>
      <Typography variant="h6" color="textSecondary">
        {calcDays} <Trans>Days</Trans>
      </Typography>
      <Typography variant="h6" color="textSecondary">
        <Trans>Current runway:</Trans>{" "}
        {currentRunway ? `${currentRunway?.toFixed(2)} ${t`Days`}` : <Trans>Loading...</Trans>}
      </Typography>
    </SliderHeaderContainer>
  );
};

const CalcContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CalcArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  .calc-input {
    width: 100%;
    max-width: revert;
  }
`;

const SliderArea = styled(CalcArea)`
  @media (max-width: 650px) {
    flex-direction: column-reverse;
  }
`;

const CalcRow = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 12px;

  flex-grow: 0;
  max-width: 100%;
  flex-basis: 100%;

  @media (min-width: 650px) {
    flex-grow: 0;
    max-width: calc(50% - 24px);
    flex-basis: 50%;
  }
  input[type] {
    font-size: 1rem;
  }
`;

const SliderContainer = styled.div`
  margin: 24px 0;
`;

const SliderHeaderContainer = styled.div<{ runwayLoaded: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  ${({ runwayLoaded }) => runwayLoaded && "cursor: pointer;"}
`;

const YugiQuote = styled.div`
  text-align: center;
  font-style: italic;
  opacity: 0.6;
  font-size: 0.7rem;
  margin-top: 1rem;
`;
