import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FireWall, NetworkElement } from "../../types/repository";
import { NetworkObjectElement, ServiceElement } from "../../types/types";
import {
  selectRepository,
  setSelectedRepository,
  updateRepositoriesAsync,
} from "../repository/repositorySlice";

function SideBar() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRepository);

  if (state.status === "empty") {
    dispatch(updateRepositoriesAsync());
  }

  if (state.status === "idle") {
    dispatch(setSelectedRepository(state.repositories[0]));
  }

  return (
    <div className="flex flex-col space-y-4 min-h-screen w-90">
      <div className="flex flex-col w-full flex-basis-1/2 ">
        <div>
          <RenderWorkSpace />
        </div>
      </div>
      <div className="flex flex-col flex-basis-1/2 border-t w-full">
        <h2>Services and Objects</h2>
        <div className="flex flex-col w-full pl-2">
          <RenderObjects />
        </div>
        <div className="flex flex-col w-full pl-2">
          <RenderServices />
        </div>
      </div>
    </div>
  );
}

export function RenderWorkSpace() {
  const state = useAppSelector(selectRepository);

  return (
    <>
      <h2>Work Space</h2>
      <ul>
        <li>
          {state.selectedRepository.workSpace.elements.map((element) =>
            RenderNetworkElement(element)
          )}
        </li>
      </ul>
    </>
  );
}

export function RenderNetworkElement(element: NetworkElement) {
  switch (element.type) {
    case "firewall": {
      return <RenderFirewall fireWall={element as FireWall} />;
    }

    default: {
      return <></>;
    }
  }
}

export function RenderFirewall({ fireWall }: { fireWall: FireWall }) {
  return <div>{fireWall.name}</div>;
}

export function RenderObjects() {
  const state = useAppSelector(selectRepository);
  return (
    <>
      <h3>Network Objects</h3>
      <ul>
        <li>
          {state.selectedRepository.networkObjects.map((element) =>
            RenderNetworkObjects(element)
          )}
        </li>
      </ul>
    </>
  );
}

export function RenderServices() {
  const state = useAppSelector(selectRepository);
  return (
    <>
      <h3>Services</h3>
      <ul>
        <li>
          {state.selectedRepository.Services.map((element) =>
            RenderService(element)
          )}
        </li>
      </ul>
    </>
  );
}

export function RenderService(service: ServiceElement) {
  return <div>{service.name}</div>;
}

export default SideBar;
function RenderNetworkObjects(element: NetworkObjectElement): any {
  return <div>{element.name}</div>;
}
