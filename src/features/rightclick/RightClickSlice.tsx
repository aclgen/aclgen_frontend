import { EditableElement } from "../../types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppState } from "../../app/store";

export interface RightClickState {
  rightClickedElement: EditableElement | undefined;
  rightClickState: "open" | "closed";
}

const initialState: RightClickState = {
  rightClickedElement: undefined,
  rightClickState: "closed",
};

export const RightClickSlice = createSlice({
  name: "RightClick",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addRightClickedElement: (state, action: PayloadAction<EditableElement>) => {
      state.rightClickedElement = action.payload;
    },
    openMenu: (state) => {
      state.rightClickState = "open";
    },
    closeMenu: (state) => {
      state.rightClickState = "closed";
      state.rightClickedElement = undefined;
    },
  },
});

export const { closeMenu, openMenu, addRightClickedElement } =
  RightClickSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRightClick = (state: AppState) => state.rightClick;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default RightClickSlice.reducer;
