import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { t } from "@lingui/macro";
import { OHM_TICKER, sOHM_TICKER } from "../constants";

export interface IPendingTxn {
  readonly txnHash: string;
  readonly text: string;
  readonly type: string;
}

const initialState: Array<IPendingTxn> = [];

const pendingTxnsSlice = createSlice({
  name: "pendingTransactions",
  initialState,
  reducers: {
    fetchPendingTxns(state, action: PayloadAction<IPendingTxn>) {
      state.push(action.payload);
    },
    clearPendingTxn(state, action: PayloadAction<string>) {
      const target = state.find(x => x.txnHash === action.payload);
      if (target) {
        state.splice(state.indexOf(target), 1);
      }
    },
  },
});

export const getStakingTypeText = (action: string) => {
  return action.toLowerCase() === "stake" ? t`Staking ${OHM_TICKER}` : t`Unstaking ${sOHM_TICKER}`;
};

export const getWrappingTypeText = (action: string) => {
  return action.toLowerCase() === "wrap" ? t`Wrapping ${OHM_TICKER}` : t`Unwrapping ${sOHM_TICKER}`;
};

export const isPendingTxn = (pendingTransactions: IPendingTxn[], type: string) => {
  return pendingTransactions.map(x => x.type).includes(type);
};

export const { fetchPendingTxns, clearPendingTxn } = pendingTxnsSlice.actions;

export default pendingTxnsSlice.reducer;
