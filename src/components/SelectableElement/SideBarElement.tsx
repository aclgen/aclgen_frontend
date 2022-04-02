import { NetworkElement, FireWall } from "../../types/repository";
import {
  ServiceElement,
  NetworkObjectElement,
  EditableElement,
} from "../../types/types";

export function RenderSideBarElement({
  name,
  icon,
  alt,
  status,
}: {
  name: string;
  icon: string;
  alt: string;
  status: "source" | "new" | "modified" | "deleted";
}) {
  const statusStyle = () => {
    switch (status) {
      case "modified":
        return "border-blue-500";
      case "new":
        return "border-green-500";
      case "deleted":
        return "display-none";
      default:
        return "border";
    }
  };
  return (
    <div
      key={name}
      className={`flex flex-row hover:shadow-lg hover:cursor-pointer hover:bg-slate-100 transition-shadow border-gray-200 ${statusStyle}  h-10 shadow-md items-center px-4 rounded-md`}
    >
      <img className="h-5" src={icon} alt={alt} />
      <p className="text-md select-none text-gray-700  pl-2">{name}</p>
    </div>
  );
}

export function RenderService(service: ServiceElement) {
  return (
    <RenderSideBarElement
      key={service.id}
      name={service.name}
      status={service.status}
      icon={"/computer-networks.svg"}
      alt={"service"}
    />
  );
}

export function RenderNetworkObjects(element: NetworkObjectElement): any {
  return (
    <RenderSideBarElement
      key={element.id}
      status={element.status}
      name={element.name}
      icon={"/server.svg"}
      alt={"Host"}
    />
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
  return (
    <RenderSideBarElement
      status={fireWall.status}
      key={fireWall.id}
      name={fireWall.name}
      icon={"/firewall.svg"}
      alt={"firewall"}
    />
  );
}
