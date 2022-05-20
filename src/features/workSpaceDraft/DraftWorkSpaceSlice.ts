import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";
import { NetworkElement } from "../../types/repository";
import { saveRulesToDraft } from "../rules/ruleSlice";
import { selectRepositoryAsync } from "../repository/repositorySlice";

export interface WorkSpaceDraftState {
  workspace: NetworkElement[];
  selectedElement: NetworkElement | undefined;
  status: "empty" | "idle" | "loading" | "failed";
}

const initialState: WorkSpaceDraftState = {
  workspace: [],
  selectedElement: undefined,
  status: "empty",
};

export const WorkSpaceDraftSlice = createSlice({
  name: "draftWorkSpace",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateWorkSpace: (state, action: PayloadAction<NetworkElement[]>) => {
      state.status = "idle";
      state.workspace = action.payload;
      if (action.payload.length > 1) {
        if (state.selectedElement) {
          state.selectedElement = action.payload.filter(
            (element) => element.id === state.selectedElement.id
          )[0];
        } else {
          state.selectedElement = action.payload[0];
        }
      }
    },
    setSelectedNetworkElement: (
      state,
      action: PayloadAction<NetworkElement>
    ) => {
      state.selectedElement = action.payload;
    },
    saveWorkSpaceToDraft: (state, _?: PayloadAction<NetworkElement[]>) => {},
  },
  extraReducers: (builder) => {
    builder.addCase(saveRulesToDraft, (state, action) => {
      state.status = "empty";
    });
    builder.addCase(selectRepositoryAsync.fulfilled, (state, action) => {
      state.status = "empty";
      state.workspace = [];
    });
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
});

export const {
  updateWorkSpace,
  saveWorkSpaceToDraft,
  setSelectedNetworkElement,
} = WorkSpaceDraftSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectWorkspaceDraft = (state: AppState) => state.draftWorkSpace;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default WorkSpaceDraftSlice.reducer;
