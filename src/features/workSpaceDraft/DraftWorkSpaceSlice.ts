import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";
import { WorkSpace } from "../../types/repository";

export interface WorkSpaceDraftState {
  workspace: WorkSpace;
  status: "empty" | "idle" | "loading" | "failed";
}

const initialState: WorkSpaceDraftState = {
  workspace: { status: "source", id: "EMPTY", children: [] },
  status: "empty",
};

export const WorkSpaceDraftSlice = createSlice({
  name: "draftWorkSpace",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateWorkSpace: (state, action: PayloadAction<WorkSpace>) => {
      state.status = "idle";
      state.workspace = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
});

export const { updateWorkSpace } = WorkSpaceDraftSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectWorkspaceDraft = (state: AppState) => state.draftWorkSpace;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default WorkSpaceDraftSlice.reducer;