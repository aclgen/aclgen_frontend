import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppDispatch, AppState, AppThunk } from "../../app/store";
import {
  FireWall,
  NetworkElement,
  Repository,
  WorkSpace,
} from "../../types/repository";
import EmptyRepository from "./EmptyRepository";
import { setSelectedRepository } from "./repositorySlice";
import { WritableDraft } from "immer/dist/internal";
import {
  EditableElement,
  NetworkObjectElement,
  ServiceElement,
  Nestable,
} from "../../types/types";
import { saveServicesToDraft } from "../service/DraftServiceSlice";
import { saveWorkSpaceToDraft } from "../workSpaceDraft/DraftWorkSpaceSlice";
import { saveNetworkObjectsToDraft } from "../networkObject/DraftNetworkObjectSlice";
import { saveRulesToDraft } from "../rules/ruleSlice";
import { commitServices } from "./repositoryAPI";

export interface DraftRepositoryState {
  repository: Repository;
  status: "empty" | "idle" | "loading" | "failed";
}

const initialState: DraftRepositoryState = {
  repository: EmptyRepository,
  status: "empty",
};

export const commitServicesAsync = createAsyncThunk<
  ServiceElement[],
  ServiceElement[],
  { dispatch: AppDispatch; state: AppState }
>(
  "draftRepository/commitServices",
  async (services: ServiceElement[], thunkAPI) => {
    thunkAPI.dispatch(
      saveServicesToDraft(thunkAPI.getState().service.services)
    );
    const response = await commitServices({ services: services });
    console.log(response);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

export const DraftRepositorySlice = createSlice({
  name: "draftRepository",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateRepositories: (state, action: PayloadAction<Repository[]>) => {},
    mergedDraftRepository: (state, action: PayloadAction<Repository>) => {},
  },

  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder.addCase(setSelectedRepository, (state, action) => {
      state.status = "loading";
      state.repository = mergeUpdatedRepository(
        state.repository,
        action.payload
      );
      state.status = "idle";
    });
    builder.addCase(saveServicesToDraft, (state, action) => {
      state.repository = { ...state.repository, services: action.payload };
    });
    builder.addCase(saveWorkSpaceToDraft, (state, action) => {
      state.repository = { ...state.repository, workSpace: action.payload };
    });
    builder.addCase(saveNetworkObjectsToDraft, (state, action) => {
      state.repository = {
        ...state.repository,
        networkObjects: action.payload,
      };
    });
    builder.addCase(saveRulesToDraft, (state, action) => {
      const index: number = state.repository.workSpace.children.findIndex(
        (element) => element.id == action.payload.parentId
      );
      const newFireWall: FireWall = {
        ...(state.repository.workSpace.children[index] as FireWall),
        rules: action.payload,
      };

      state.repository = {
        ...state.repository,
        workSpace: {
          ...state.repository.workSpace,
          children: [
            ...state.repository.workSpace.children.slice(0, index),
            newFireWall,
            ...state.repository.workSpace.children.slice(index + 1),
          ],
        },
      };
    });
    builder.addCase(commitServicesAsync.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(commitServicesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      const services = action.payload;
      state.repository = {
        ...state.repository,
        services: state.repository.services.filter((element) =>
          services.find((service) => service.id === element.id) === undefined
            ? true
            : false
        ),
      };
    });
  },
});

export const { updateRepositories, mergedDraftRepository } =
  DraftRepositorySlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectDraftRepository = (state: AppState) => state.draftRepository;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.

export default DraftRepositorySlice.reducer;

function mergeUpdatedRepository(
  repository: WritableDraft<Repository>,
  payload: Repository
): Repository {
  const children: NetworkElement[] = mergeWorkSpace(
    payload.workSpace,
    repository.workSpace
  );
  const workSpace = { ...repository.workSpace, children };
  const services: ServiceElement[] = mergeServices(
    payload.services,
    repository.services
  );
  const networkObjects: NetworkObjectElement[] = mergeNetworkObjects(
    payload.networkObjects,
    repository.networkObjects
  );

  return { ...payload, workSpace, services, networkObjects };
}
function mergeWorkSpace(
  sourceWorkSpace: WorkSpace,
  draftWorkspace: WorkSpace
): NetworkElement[] {
  return mergeEditableElements(
    sourceWorkSpace.children,
    draftWorkspace.children
  );
}

function mergeServices(
  sourceServices: ServiceElement[],
  draftServices: ServiceElement[]
): ServiceElement[] {
  return mergeEditableElements(sourceServices, draftServices);
}

function mergeNetworkObjects(
  sourceNetworkElements: NetworkObjectElement[],
  draftNetworkElements: NetworkObjectElement[]
): NetworkObjectElement[] {
  return mergeEditableElements(sourceNetworkElements, draftNetworkElements);
}

function mergeEditableElements<T extends EditableElement>(
  sourceElements: T[],
  draftElements: T[]
): T[] {
  const source: T[] = [...sourceElements];
  const newElements: T[] = draftElements.filter(
    (element: T) => element.status === "modified" || element.status === "new"
  );

  if (draftElements.length === 0) {
    source;
  }

  var newArray: T[] = [...sourceElements];

  for (let i = 0; i < newElements.length; i++) {
    const index = draftElements.findIndex(
      (element) => element.id === newElements[i].id
    );
    newArray = [
      ...newArray.slice(0, index + i),
      newElements[i],
      ...newArray.slice(index + i),
    ];
  }

  return newArray;
}
function mergeElement<T extends EditableElement>(source: T, newElement: T): T {
  if (newElement.status === "source") {
    return source;
    //nestable means an object containing children element, i.e. folder or grouped object
  } else if (isNestable(source) && isNestable(newElement)) {
    mergeEditableElements(
      source.children as EditableElement[],
      newElement.children as EditableElement[]
    );
  } else {
    return newElement;
  }
}

function isNestable<T>(element: any): element is Nestable<T> {
  return element.children !== undefined;
}
