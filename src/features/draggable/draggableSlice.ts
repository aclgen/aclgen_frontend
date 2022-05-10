import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../../app/store";

export interface DraggableState {
  currentDroppedItem:
    | {
        dropped: {
          id: string;
          type: "object" | "service" | "rule";
        };
        target: string;
      }
    | undefined;
  currentDraggedItem:
    | {
        id: string;
        type: "object" | "service" | "rule";
      }
    | undefined;
}

export type DraggableType = "object" | "service" | "rule";

const initialState: DraggableState = {
  currentDroppedItem: undefined,
  currentDraggedItem: undefined,
};

export const DraggableSlice = createSlice({
  name: "draggableSlice",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    removeDraggedItem: (state) => {
      state.currentDroppedItem = undefined;
    },
    addDraggedItem: (
      state,
      action: PayloadAction<{
        dropped: { id: string; type: "service" | "object" };
        target: string;
      }>
    ) => {
      state.currentDroppedItem = action.payload;
    },
    stopDragging: (state) => {
      state.currentDraggedItem = undefined;
    },
    startDragging: (
      state,
      action: PayloadAction<{ id: string; type: "service" | "object" }>
    ) => {
      state.currentDraggedItem = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {},
});

export const {
  addDraggedItem,
  removeDraggedItem,
  startDragging,
  stopDragging,
} = DraggableSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectDraggable = (state: AppState) => state.draggable;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default DraggableSlice.reducer;
