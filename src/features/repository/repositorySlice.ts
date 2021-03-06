import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState } from "../../app/store";
import { fetchRepositories } from "./repositoryAPI";
import {
  ACCESS,
  FireWall,
  LockStatus,
  NetworkElement,
  Repository,
} from "../../types/repository";
import EmptyRepository from "./EmptyRepository";
import {
  commitObjectsAsync,
  commitServicesAsync,
  saveRulesAsync,
} from "./DraftRepositorySlice";
import { fetchServicesWithRepoId } from "../service/serviceAPI";
import { fetchNetworkObjectsWithRepoId } from "../networkObject/networkObjectAPI";
import { fetchDevicesWithRepoId } from "../workSpaceDraft/WorkSpaceAPI";
import { fetchRulesWithDeviceId } from "../rules/ruleAPI";
import { RepositoryIdentifier } from "../common/APITypes";
import { createServiceFromState } from "../service/ServiceFactory";

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

    const apiRules = await fetchRulesWithDeviceId(id, all[2][0].id);

    const services = all[0].data.map((element) =>
      createServiceFromState(element)
    );

    const networkObjects = all[1].data;

    //networkObjects.filter((source) => source.id === element.source),
    let rules = apiRules.map((element) => {
      return {
        ...element,
        policy: element.action,
        lock: element.lock ? element.lock : LockStatus.UNLOCKED,
        device: all[2][0].id,
        sources: element.sources.map((elementSource) =>
          networkObjects.find(
            (serviceElement) => serviceElement.id === elementSource
          )
        ),
        destinations: element.destinations.map((elementDestinations) =>
          networkObjects.find(
            (serviceElement) => serviceElement.id === elementDestinations
          )
        ),
        sourceServices: element.services_sources.map((elementService: string) =>
          services.find(
            (serviceElement) => serviceElement.id === elementService
          )
        ),
        destinationServices: element.services_destinations.map(
          (elementService: string) =>
            services.find(
              (serviceElement) => serviceElement.id === elementService
            )
        ),
      };
    });

    /**
    // Testing scrolling behaviour when there are too many elements
    rules = rules.flatMap((i) => [i, i]);
    rules = rules.flatMap((i) => [i, i]);
    rules = rules.flatMap((i) => [i, i]);
    rules = rules.flatMap((i) => [i, i]);
    rules = rules.flatMap((i) => [i, i]);
    rules = rules.flatMap((i) => [i, i]);
 */

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
        if (action.payload.length == 0) {
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
      /** 
      const newService: ServiceElement[] = [];
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
*/
      state.selectedRepository = EmptyRepository;
      state.status = "idle";
    });
    builder.addCase(commitObjectsAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(commitObjectsAsync.fulfilled, (state, action) => {
      state.status = "idle";
      //...state.repositories[0].services
      /** 
      const newService: ServiceElement[] = [];
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
*/
      state.selectedRepository = EmptyRepository;
      state.status = "idle";
    });
    builder.addCase(saveRulesAsync.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(saveRulesAsync.fulfilled, (state, action) => {
      state.status = "idle";

      state.selectedRepository = EmptyRepository;
      state.status = "idle";
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
