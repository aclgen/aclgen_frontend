"use strict";
var _a;
exports.__esModule = true;
exports.selectDraggable = exports.stopDragging = exports.startDragging = exports.removeDraggedItem = exports.addDraggedItem = exports.DraggableSlice = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var initialState = {
    currentDroppedItem: undefined,
    currentDraggedItem: undefined
};
exports.DraggableSlice = toolkit_1.createSlice({
    name: "draggableSlice",
    initialState: initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        removeDraggedItem: function (state) {
            state.currentDroppedItem = undefined;
        },
        addDraggedItem: function (state, action) {
            state.currentDroppedItem = action.payload;
        },
        stopDragging: function (state) {
            state.currentDraggedItem = undefined;
        },
        startDragging: function (state, action) {
            state.currentDraggedItem = action.payload;
        }
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: function (builder) { }
});
exports.addDraggedItem = (_a = exports.DraggableSlice.actions, _a.addDraggedItem), exports.removeDraggedItem = _a.removeDraggedItem, exports.startDragging = _a.startDragging, exports.stopDragging = _a.stopDragging;
// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
exports.selectDraggable = function (state) { return state.draggable; };
// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
exports["default"] = exports.DraggableSlice.reducer;
