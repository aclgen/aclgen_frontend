import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import ruleReducer from "../features/rules/ruleSlice";
import ServiceReducer from "../features/service/DraftServiceSlice";
import DraftNetworkObjectReducer from "../features/networkObject/DraftNetworkObjectSlice";
import RepositoryReducer from "../features/repository/repositorySlice";
import DraftRepositoryReducer from "../features/repository/DraftRepositorySlice";
import DraftWorkSpaceReducer from "../features/workSpaceDraft/DraftWorkSpaceSlice";
import DraggableSliceReducer from "../features/draggable/draggableSlice";
import RightClickReducer from "../features/rightclick/RightClickSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      rule: ruleReducer,
      service: ServiceReducer,
      networkObject: DraftNetworkObjectReducer,
      repository: RepositoryReducer,
      draftRepository: DraftRepositoryReducer,
      draftWorkSpace: DraftWorkSpaceReducer,
      draggable: DraggableSliceReducer,
      rightClick: RightClickReducer,
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
