import { BigNumber, BigNumberish, ethers } from "ethers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { info, error } from "./MessagesSlice";

export type PollUpdateStateParams = {
  field: string;
  stateAccessor: string;
  thunkToCall: () => Promise<any>;
  attempts?: number;
  isMany?: boolean;
};

// Used to poll for updates in users balances, needed due to fantom RPCs often taking time to return updated chain data.
// From experiance, queries after successful transactions can take anywhere from 0-30 seconds to return updated chain data.
export const pollUpdateState: any = createAsyncThunk(
  "account/pollUpdateState",
  async (
    { field, stateAccessor, thunkToCall, attempts = 0, isMany = false }: PollUpdateStateParams,
    { dispatch, getState },
  ) => {
    let state: any = getState();

    const initialValue = _.get(state, stateAccessor);
    const result: any = await thunkToCall();
    const resultValue = _.get(result.payload, field);

    // Loop is handled in the pollManyUpdateState function instead of here for querying many calls at the same time.
    if (isMany) return initialValue !== resultValue;

    if (initialValue === resultValue) {
      if (attempts === 0) {
        dispatch(info("Transaction successful! Please wait while we fetch your updated balances."));
      }

      if (attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        dispatch(pollUpdateState({ field, stateAccessor, thunkToCall, attempts: attempts + 1 }));
      } else {
        dispatch(error("Oops! Couldn't update some of your balances, please try refreshing the page."));
      }
    }
  },
);

type PollManyUpdateStateParams = {
  statesToPoll: Array<PollUpdateStateParams>;
};

export const pollManyUpdateState = createAsyncThunk(
  "account/pollUpdateManyState",
  async ({ statesToPoll }: PollManyUpdateStateParams, { dispatch }) => {
    let statesToCheck = statesToPoll;

    for (let i = 0; i < 10; i++) {
      const results = await Promise.all(
        statesToCheck.map(stateCheck => dispatch(pollUpdateState({ ...stateCheck, isMany: true }))),
      );

      if (i === 0 && results.some(({ payload: success }) => !success)) {
        dispatch(info("Transaction successful! Please wait while we fetch your updated balances."));
      }

      statesToCheck = statesToCheck.filter((_, index) => !results[index].payload);
      if (!statesToCheck.length) break;

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (statesToCheck.length) {
      dispatch(error("Oops! Couldn't update some of your balances, please try refreshing the page."));
    }
  },
);

const initialState = {};

const pollStateUpdateSlice = createSlice({
  name: "poll",
  initialState,
  reducers: {
    pollUpdateSuccess(state, action) {},
  },
});

export default pollStateUpdateSlice.reducer;
