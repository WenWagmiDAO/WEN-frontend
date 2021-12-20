import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { Trans } from "@lingui/macro";
import styled from "styled-components";
import { sOHM_TICKER } from "../../constants";
import { trim } from "../../helpers";
import { Skeleton } from "@material-ui/lab";

type ImportantValuesProps = {
  marketPrice: number;
  stakingRebase: number;
  isAppLoading: boolean;
  trimmedBalance: number;
};

const ImportantValues = ({ marketPrice, stakingRebase, isAppLoading, trimmedBalance }: ImportantValuesProps) => {
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);

  return (
    <Grid item>
      <Grid container spacing={2} alignItems="flex-end">
        <FieldValue value={`$${trim(marketPrice, 2)}`} field={<Trans>WEN Price</Trans>} isAppLoading={isAppLoading} />
        <FieldValue
          value={`${stakingRebasePercentage}%`}
          field={<Trans>Current Rebase Rate</Trans>}
          isAppLoading={isAppLoading}
        />
        <FieldValue
          value={`${trimmedBalance} ${sOHM_TICKER}`}
          field={<Trans>Your sWEN Balance</Trans>}
          isAppLoading={isAppLoading}
        />
      </Grid>
    </Grid>
  );
};

export default ImportantValues;

const FieldValue = ({ field, value, isAppLoading }: { field: any; value: any; isAppLoading: boolean }) => {
  return (
    <Grid item xs={12} sm={4} md={4} lg={4}>
      <FieldContainer>
        <Typography variant="h5" color="textSecondary">
          {field}
        </Typography>
        <Typography variant="h4">
          {isAppLoading ? (
            <Skeleton width="150px" data-testid="apy-loading" />
          ) : (
            <span data-testid="apy-value">{value}</span>
          )}
        </Typography>
      </FieldContainer>
    </Grid>
  );
};

const FieldContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
`;
