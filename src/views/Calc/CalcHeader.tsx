import React from "react";
import { Grid, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Trans } from "@lingui/macro";

const CalcHeader = () => {
  return (
    <Grid item>
      <Heading variant="h5">
        <Trans>OBLITERATOR</Trans> (🧪 + 🧪 = ❔)
      </Heading>
      <Typography variant="body1">
        <Trans>Estimate your returns</Trans>
      </Typography>
    </Grid>
  );
};

export default CalcHeader;

const Heading = styled(Typography)`
  font-weight: 600 !important;
  margin-bottom: 2px !important;
`;
