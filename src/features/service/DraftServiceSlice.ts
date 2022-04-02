import { ServiceElement } from "../../types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "../../app/store";
import { initiateNewRule } from "../rules/ruleSlice";
import { initiateNewObject } from "../networkObject/DraftNetworkObjectSlice";
import { setSelectedRepository } from "../repository/repositorySlice";
import { stat } from "fs";

export interface ServiceState {
  services: ServiceElement[];
  newService: ServiceElement | undefined;
  newServiceStatus: "idle" | "creating" | "editing";
  status: "empty" | "idle" | "loading" | "failed";
}

const initialState: ServiceState = {
  services: [],
  status: "empty",
  newService: undefined,
  newServiceStatus: "idle",
};

export const ServiceSlice = createSlice({
  name: "service",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateServices: (state, action: PayloadAction<ServiceElement[]>) => {
      state.services = action.payload;
      state.status = "idle";
    },
    createNewService: (state, action: PayloadAction<ServiceElement>) => {
      state.newService = undefined;
      state.services = [...state.services, action.payload];
      state.newServiceStatus = "idle";
    },
    initiateNewService: (state) => {
      state.newService = undefined;
      state.newServiceStatus = "creating";
    },
    modifyService: (state, action: PayloadAction<ServiceElement>) => {
      state.newService = undefined;
      state.newServiceStatus = "idle";
      const index = state.services.findIndex(
        (element) => element.id === action.payload.id
      );
      state.services[index] = action.payload;
      state.services = [...state.services];
    },
    initiateModifyService: (state, action: PayloadAction<ServiceElement>) => {
      if (
        state.newServiceStatus === "editing" &&
        state.newService.id === action.payload.id
      ) {
        state.newService = undefined;
        state.newServiceStatus = "idle";
      } else {
        state.newService = { ...action.payload, id: action.payload.id };
        state.newServiceStatus = "editing";
      }
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(initiateNewObject, (state, payload) => {
      state.newService = undefined;
      state.newServiceStatus = "idle";
    });
    builder.addCase(initiateNewRule, (state, payload) => {
      state.newService = undefined;
      state.newServiceStatus = "idle";
    });
  },
});

export const {
  updateServices,
  modifyService,
  createNewService,
  initiateNewService,
  initiateModifyService,
} = ServiceSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectService = (state: AppState) => state.service;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default ServiceSlice.reducer;
