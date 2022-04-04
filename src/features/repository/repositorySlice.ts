import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "../../app/store";
import { fetchRepositories } from "./repositoryAPI";
import { Repository } from "../../types/repository";
import EmptyRepository from "./EmptyRepository";
import { commitServicesAsync } from "./DraftRepositorySlice";

export interface RepositoryState {
  repositories: Repository[];
  selectedRepository: Repository;
  status: "empty" | "idle" | "loading" | "failed";
}

const initialState: RepositoryState = {
  repositories: [],
  selectedRepository: EmptyRepository,
  status: "empty",
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const updateRepositoriesAsync = createAsyncThunk(
  "repository/fetchRepositories",
  async () => {
    const response = await fetchRepositories();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

export const RepositorySlice = createSlice({
  name: "repository",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateRepositories: (state, action: PayloadAction<Repository[]>) => {},
    setSelectedRepository: (state, action: PayloadAction<Repository>) => {
      state.selectedRepository = action.payload;
      state.status = "idle";
    },
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(updateRepositoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateRepositoriesAsync.rejected, (state) => {
        state.status = "failed";
        state.repositories = [];
      })
      .addCase(updateRepositoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.repositories = action.payload;
      });
    builder.addCase(commitServicesAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(commitServicesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.repositories = [
        {
          ...state.repositories[0],
          services: [
            ...state.repositories[0].services,
            ...action.payload.map((element) => {
              return { ...element, status: "source" };
            }),
          ],
        },
      ];
    });
  },
});

export const { updateRepositories, setSelectedRepository } =
  RepositorySlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRepository = (state: AppState) => state.repository;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default RepositorySlice.reducer;
