import { NetworkElement, FireWall } from "../../types/repository";
import {
  ServiceElement,
  NetworkObjectElement,
  EditableElementStatus,
} from "../../types/types";

export function RenderSideBarElement({
  name,
  icon,
  alt,
  status,
  onClick,
}: {
  name: string;
  icon: string;
  alt: string;
  status: "source" | "new" | "modified" | "deleted";
  onClick: () => void;
}) {
  return (
    <div
      key={name}
      onClick={onClick}
      className={`flex flex-row hover:shadow-lg hover:cursor-pointer hover:bg-slate-100 transition-shadow  ${statusStyle(
        status
      )}  h-10 shadow-md items-center px-4 rounded-md`}
    >
      <img className="h-5" src={icon} alt={alt} />
      <p className="text-md select-none text-gray-700  pl-2">{name}</p>
    </div>
  );
}

export function RenderService(service: ServiceElement, onClick: () => void) {
  if (service.status !== "deleted") {
    return (
      <RenderSideBarElement
        key={service.id}
        name={service.name}
        status={service.status}
        icon={"/computer-networks.svg"}
        alt={"service"}
        onClick={() => onClick()}
      />
    );
  }
}

export function RenderNetworkObjects(
  element: NetworkObjectElement,
  onClick: () => void
): any {
  if (element.status !== "deleted") {
    return (
      <RenderSideBarElement
        key={element.id}
        status={element.status}
        name={element.name}
        icon={"/server.svg"}
        alt={"Host"}
        onClick={onClick}
      />
    );
  }
}

export function RenderNetworkElement(
  element: NetworkElement,
  onClick: () => void
) {
  switch (element.type) {
    case "firewall": {
      return (
        <RenderFirewall fireWall={element as FireWall} onClick={onClick} />
      );
    }

    default: {
      return <></>;
    }
  }
}

export function RenderFirewall({
  fireWall,
  onClick,
}: {
  fireWall: FireWall;
  onClick: () => void;
}) {
  return (
    <RenderSideBarElement
      status={fireWall.status}
      key={fireWall.id}
      name={fireWall.name}
      icon={"/firewall.svg"}
      alt={"firewall"}
      onClick={onClick}
    />
  );
}

export const statusStyle = (status: EditableElementStatus) => {
  switch (status) {
    case "modified":
      return "border-blue-500 border-2";
    case "new":
      return "border-green-500 border-2";
    case "deleted":
      return "display-none";
    case "source":
      return "border-gray-200 border-2";
  }
};
