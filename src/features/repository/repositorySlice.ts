import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "../../app/store";
import { fetchRepositories } from "./repositoryAPI";
import {
  ACCESS,
  FireWall,
  NetworkElement,
  Repository,
} from "../../types/repository";
import EmptyRepository from "./EmptyRepository";
import { commitServicesAsync } from "./DraftRepositorySlice";
import { fetchServicesWithRepoId } from "../service/serviceAPI";
import { fetchNetworkObjectsWithRepoId } from "../networkObject/networkObjectAPI";
import { fetchDevicesWithRepoId } from "../workSpaceDraft/WorkSpaceAPI";
import { fetchRulesWithDeviceId } from "../rules/ruleAPI";
import { IPV4, PortService } from "../../types/types";
import { RepositoryIdentifier } from "../common/APITypes";

export interface RepositoryState {
  repositories: RepositoryIdentifier[];
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

export const selectRepositoryAsync = createAsyncThunk(
  "repository/fetchRepositoryFull",
  async (id: string) => {
    const all = await Promise.all([
      fetchServicesWithRepoId(id),
      fetchNetworkObjectsWithRepoId(id),
      fetchDevicesWithRepoId(id),
    ]);
    console.log("test");
    let rules = await fetchRulesWithDeviceId(id, all[2][0].id);

    const services = all[0].map((element) => {
      return { ...element, status: "source" } as PortService;
    });

    const networkObjects = all[1].map((element) => {
      return { ...element, status: "source" } as IPV4;
    });

    rules = rules.map((element: any) => {
      return {
        ...element,
        source: networkObjects.filter((source) => source.id === element.source),
        destination: networkObjects.filter(
          (source) => source.id === element.destination
        ),
        service: services.filter((source) => source.id === element.service),
      };
    });

    const workSpace: NetworkElement[] = all[2].map((element) => {
      return { ...element, status: "source" };
    });
    (workSpace[0] as FireWall).rules = rules.map((element) => {
      return { ...element, status: "source" };
    });

    const repo: Repository = {
      id: id,
      access: ACCESS.PUBLIC,
      repo: "testRepo",
      description: "YUUp",
      logo: "Nope",
      workSpace: workSpace,
      networkObjects: networkObjects,
      services: services,
    };

    // The value we return becomes the `fulfilled` action payload
    return repo;
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
      .addCase(selectRepositoryAsync.pending, (state) => {
        state.status = "loading";
        state.selectedRepository = EmptyRepository;
      })
      .addCase(selectRepositoryAsync.rejected, (state) => {
        state.status = "failed";
        state.repositories = [];
      })
      .addCase(selectRepositoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.selectedRepository = action.payload;
      });
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
        if (action.payload.length == 0){
            state.status = "failed";
        }
        state.repositories = action.payload;
      });
    builder.addCase(commitServicesAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(commitServicesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      //...state.repositories[0].services
      const newService = [];
      for (let i = 0; i < action.payload.length; i++) {
        const index = newService.findIndex(
          (element) => action.payload[i].id === element.id
        );
        if (index >= 0) {
          if (action.payload[i].status === "deleted") {
            newService.splice(index);
          } else {
            newService[index] = { ...action.payload[i], status: "source" };
          }
        } else {
          if (action.payload[i].status !== "deleted") {
            newService.push({ ...action.payload[i], status: "source" });
          }
        }
      }
      state.repositories = [
        {
          ...state.repositories[0],
          //services: newService,
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
