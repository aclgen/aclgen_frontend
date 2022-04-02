import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { DropDownButton } from "../../components/DropDownButton";
import {
  RenderNetworkElement,
  RenderNetworkObjects,
  RenderService,
  RenderSideBarElement,
} from "../../components/SelectableElement/SideBarElement";
import { FireWall, NetworkElement } from "../../types/repository";
import { NetworkObjectElement, ServiceElement } from "../../types/types";
import {
  initiateNewObject,
  selectNetworkObjects,
  updateNetworkObjects,
} from "../networkObject/DraftNetworkObjectSlice";
import DraftRepositorySlice, {
  selectDraftRepository,
} from "../repository/DraftRepositorySlice";
import {
  selectRepository,
  setSelectedRepository,
  updateRepositoriesAsync,
} from "../repository/repositorySlice";
import {
  initiateNewService,
  selectService,
  updateServices,
} from "../service/DraftServiceSlice";
import {
  selectWorkspaceDraft,
  updateWorkSpace,
} from "../workSpaceDraft/DraftWorkSpaceSlice";

function SideBar() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRepository);

  useEffect(() => {
    if (state.status === "empty") {
      dispatch(updateRepositoriesAsync());
    }

    if (state.status === "idle") {
      dispatch(setSelectedRepository(state.repositories[0]));
    }
  }, [state.status]);

  return (
    <div className="flex flex-col space-y-4  min-w-90">
      <div className="flex flex-col w-full flex-basis-1/2 pb-8 pl-4 ">
        <RenderWorkSpace />
      </div>
      <div className="flex flex-col flex-basis-1/2 border-t w-full pb-8 pt-4 pl-4">
        <RenderObjectsAndServices />
      </div>
    </div>
  );
}

export function RenderWorkSpace() {
  const state = useAppSelector(selectWorkspaceDraft);
  const draftRepositoryState = useAppSelector(selectDraftRepository);
  const dispatch = useAppDispatch();

  if (state.status === "empty" && draftRepositoryState.status === "idle") {
    dispatch(updateWorkSpace(draftRepositoryState.repository.workSpace));
  }

  return (
    <>
      <div className="flex flex-row items-center h-12">
        <h2 className="text-lg font-light items-start">Workspace</h2>
        <PlusButtonSVG />
      </div>

      <ul className="pl-4">
        <li>
          {state.workspace.children.map((element) =>
            RenderNetworkElement(element)
          )}
        </li>
      </ul>
    </>
  );
}

export function RenderObjectsAndServices() {
  const [droppedDown, setDropdown] = useState(false);
  const dispatch = useAppDispatch();
  return (
    <>
      <div className="flex flex-row items-center h-12">
        <h2 className="text-lg font-light items-start">Services and Objects</h2>
        <button
          className="outline-none"
          onClick={() => setDropdown(!droppedDown)}
        >
          <PlusButtonSVG />
        </button>
      </div>
      <ul
        className={`mt-2 shadow-md flex-col mb-4 border-gray-200 rounded-md ${
          droppedDown ? "scale-100 h-fit" : "scale-y-0 h-0"
        } transform origin-top  duration-300 transition space-y-1 `}
      >
        <li
          onClick={() => {
            setDropdown(false);
            dispatch(initiateNewObject());
          }}
          className="hover:bg-blue-600 hover:cursor-pointer group py-2 px-0 select-none border-b flex-row"
        >
          <span className="px-2 text-gray-700 w-100 group-hover:text-white">
            Create new Object
          </span>
        </li>
        <li
          onClick={() => {
            setDropdown(false);
            dispatch(initiateNewService());
          }}
          className="hover:bg-blue-600 group hover:cursor-pointer py-2 px-0 select-none border-b flex-row items-center"
        >
          <p className="px-2 text-gray-700 group-hover:text-white">
            Create new Service
          </p>
        </li>
      </ul>
      <div className="flex flex-col w-full pl-2">
        <RenderObjects />
      </div>
      <div className="flex flex-col w-full pl-2">
        <RenderServices />
      </div>
    </>
  );
}

export function PlusButtonSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-6 pt-1 pl-4 ml-auto items-end group hover:cursor-pointer"
    >
      <path
        d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0"
        className="group-hover:fill-blue-600 group-hover:shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />

      <path
        d="m368 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0"
        className="fill-blue-600 opacity-100 group-hover:opacity-0 transition-opacity duration-150"
      />
      <path
        d="m368 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0"
        className="fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />
    </svg>
  );
}

export function RenderObjects() {
  const draftRepositoryState = useAppSelector(selectDraftRepository);
  const objectState = useAppSelector(selectNetworkObjects);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      draftRepositoryState.status == "idle" &&
      objectState.status === "empty"
    ) {
      dispatch(
        updateNetworkObjects(draftRepositoryState.repository.networkObjects)
      );
    }
  });

  const state = useAppSelector(selectRepository);
  const [droppedDown, setDropdown] = useState(false);
  return (
    <div className="h-fit flex flex-col">
      <DropDownButton
        isDropped={droppedDown}
        onClick={setDropdown}
        title="Network Objects"
      />
      <ul
        className={`mt-2 pl-4 pb-4 ${
          droppedDown ? "scale-100 h-fit" : "scale-0 h-0"
        } transform origin-top ease-in-out duration-150 transition space-y-4`}
      >
        <li>
          {objectState.networkObjects.map((element) =>
            RenderNetworkObjects(element)
          )}
        </li>
      </ul>
    </div>
  );
}

export function RenderServices() {
  const draftRepositoryState = useAppSelector(selectDraftRepository);
  const serviceState = useAppSelector(selectService);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      draftRepositoryState.status == "idle" &&
      serviceState.status === "empty"
    ) {
      dispatch(updateServices(draftRepositoryState.repository.services));
    }
  });

  const [droppedDown, setDropdown] = useState(false);
  return (
    <div>
      <DropDownButton
        isDropped={droppedDown}
        onClick={setDropdown}
        title="Services"
      />
      <ul
        className={`mt-2 pl-4 pb-4 ${
          droppedDown ? "scale-100 h-fit" : "scale-0 h-0"
        } transform origin-top ease-in-out duration-150 transition space-y-1`}
      >
        {serviceState.services.map((element) => {
          return <li> {RenderService(element)} </li>;
        })}
      </ul>
    </div>
  );
}

export default SideBar;
