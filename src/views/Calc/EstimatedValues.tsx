import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import styled from "styled-components";

type EstimatedValuesProps = {
  initialInvestment: number;
  estimatedROI: number;
  estimatedProfits: number;
  totalSExod: number;
  totalReturns: number;
  breakEvenDays: number;
  minimumPrice: number;
};

const EstimatedValues = ({
  initialInvestment,
  estimatedROI,
  estimatedProfits,
  totalSExod,
  breakEvenDays,
  minimumPrice,
  totalReturns,
}: EstimatedValuesProps) => {
  return (
    <>
      <EstimationColumn>
        <FieldValue
          field={<Trans>Initial investment</Trans>}
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(initialInvestment)}
        />
        <div />
        <FieldValue field={<Trans>Estimated ROI</Trans>} value={`${estimatedROI ? estimatedROI.toFixed(2) : 0}x`} />
        <FieldValue field={<Trans>Total sWEN</Trans>} value={`${totalSExod.toFixed(2)}`} />
        <FieldValue
          field={<Trans>Estimated profits</Trans>}
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(estimatedProfits)}
        />
        <FieldValue
          field={<Trans>Total returns</Trans>}
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(totalReturns)}
        />
      </EstimationColumn>
      <EstimationColumn>
        <FieldValue
          field={<Trans>Break even price</Trans>}
          value={new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }).format(minimumPrice || 0)}
        />
        <FieldValue field={<Trans>Days to break even</Trans>} value={`${breakEvenDays}`} />
      </EstimationColumn>
    </>
  );
};

export default EstimatedValues;

const FieldValue = ({ field, value }: { field: any; value: string }) => {
  return (
    <EstimationRow>
      <Typography variant="h6" color="textSecondary">
        {field}
      </Typography>
      <Typography variant="h6" color="textPrimary">
        {value}
      </Typography>
    </EstimationRow>
  );
};

const EstimationColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-column-gap: 24px;
  border-top: 1px solid #424242;
  width: 100%;
  padding: 12px;
`;

const EstimationRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0px;
`;
