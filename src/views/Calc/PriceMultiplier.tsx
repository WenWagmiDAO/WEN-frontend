import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OutlinedInput, Typography, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { Trans, t } from "@lingui/macro";

const PriceMultiplier = ({
  currentPrice,
  setFinalExodPriceInput,
}: {
  currentPrice: number;
  setFinalExodPriceInput: (value: number) => void;
}) => {
  const [multiplier, setMultiplier] = useState();

  useEffect(() => {
    setFinalExodPriceInput(currentPrice * (multiplier || 1));
  }, [multiplier]);

  return (
    <PriceMultiplierContainer>
      <Typography variant="h6" color="textSecondary">
        <Trans>Future price multiplier</Trans>
      </Typography>
      <MultiplierRow>
        <RadioGroup
          row
          aria-label="multiplier"
          name="row-radio-buttons-group"
          value={multiplier || 1}
          onChange={e => setMultiplier(Number(e.target.value))}
        >
          <FormControlLabel value={1 || null} control={<Radio size="small" color="primary" />} label="1x" />
          <FormControlLabel value={5} control={<Radio size="small" color="primary" />} label="5x" />
          <FormControlLabel value={10} control={<Radio size="small" color="primary" />} label="10x" />
        </RadioGroup>
        <OutlinedInput
          type="number"
          placeholder={t`Custom...`}
          value={multiplier || null}
          onChange={e => setMultiplier(Number(e.target.value) || null)}
          labelWidth={0}
        />
      </MultiplierRow>
    </PriceMultiplierContainer>
  );
};

export default PriceMultiplier;

const PriceMultiplierContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 12px 0;
`;

const MultiplierRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  path {
    transform: translate(-2px, -2px);
  }
`;
