import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";
import { Rule, RuleElement } from "../../types/types";
import { initiateNewObject } from "../networkObject/DraftNetworkObjectSlice";
import {
  cancelCreationPopUp,
  initiateNewService,
} from "../service/DraftServiceSlice";
import { fetchRules } from "./ruleAPI";

export interface DraftRuleState {
  rules: RuleElement[];
  status: "empty" | "idle" | "loading" | "failed";
  newRule: Rule | undefined;
  newRuleStatus: "idle" | "creating" | "loading";
}

const initialState: DraftRuleState = {
  rules: [],
  status: "empty",
  newRule: undefined,
  newRuleStatus: "idle",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const updateAsync = createAsyncThunk("rules/fetchRules", async () => {
  const response = await fetchRules();
  // The value we return becomes the `fulfilled` action payload
  return response.data;
});

export const DraftRuleSlice = createSlice({
  name: "draftRule",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateRules: (
      state,
      action: PayloadAction<(rules: RuleElement[]) => RuleElement[]>
    ) => {
      state.rules = action.payload(state.rules);
    },
    setRules: (state, action: PayloadAction<RuleElement[]>) => {
      state.rules = action.payload;
      state.status = "idle";
    },
    modifyRule: (state, action: PayloadAction<RuleElement>) => {
      const index = state.rules.findIndex(
        (element) => element.id === action.payload.id
      );
      state.rules = [
        ...state.rules.slice(0, index),
        action.payload,
        ...state.rules.slice(index + 1),
      ];
    },
    createNewRule: (state, action: PayloadAction<Rule>) => {
      state.newRule = undefined;
      state.rules = [...state.rules, action.payload];
      state.newRuleStatus = "idle";
    },
    initiateNewRule: (state) => {
      state.newRule = undefined;
      state.newRuleStatus = "creating";
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder;

    builder.addCase(initiateNewObject, (state, payload) => {
      state.newRule = undefined;
      state.newRuleStatus = "idle";
    });
    builder.addCase(initiateNewService, (state, payload) => {
      state.newRule = undefined;
      state.newRuleStatus = "idle";
    });
    builder.addCase(cancelCreationPopUp, (state) => {
      state.newRule = undefined;
      state.newRuleStatus = "idle";
    });
  },
});

export const {
  updateRules,
  modifyRule,
  initiateNewRule,
  createNewRule,
  setRules,
} = DraftRuleSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRule = (state: AppState) => state.rule;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default DraftRuleSlice.reducer;
