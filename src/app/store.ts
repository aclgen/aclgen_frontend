import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import counterReducer from "../features/counter/counterSlice";
import ruleReducer from "../features/rules/ruleSlice";
import ServiceReducer from "../features/service/serviceSlice";
import NetworkObjectReducer from "../features/networkObject/networkObjectSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      rule: ruleReducer,
      service: ServiceReducer,
      networkObject: NetworkObjectReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
