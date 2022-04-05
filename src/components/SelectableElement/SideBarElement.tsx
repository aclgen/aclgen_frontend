import { NetworkElement, FireWall } from "../../types/repository";
import {
  ServiceElement,
  NetworkObjectElement,
  EditableElementStatus,
} from "../../types/types";
import { getHeight, Size } from "../creationForm/PopUpForm";

export function RenderSideBarElement({
  name,
  icon,
  alt,
  status,
  onClick,
  onClickCheck,
}: {
  name: string;
  icon: string;
  alt: string;
  status: "source" | "new" | "modified" | "deleted";
  onClick: () => void;
  onClickCheck?: () => void;
}) {
  return (
    <div
      key={name}
      onClick={onClick}
      className={`flex flex-row bg-white  hover:shadow-lg hover:cursor-pointer hover:shadow-lg transition-shadow  ${statusStyle(
        status
      )}  h-10 shadow-md items-center px-4 rounded-md`}
    >
      <img className="h-5" src={icon} alt={alt} />
      <p className="text-md select-none text-gray-700  pl-2">{name}</p>
      <div className="ml-auto">
        {status !== "source" ? (
          <CheckIcon
            onClick={(e) => {
              e.stopPropagation();
              onClickCheck();
            }}
            size="md"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export const CheckIcon = ({
  onClick,
  size = "md",
}: {
  onClick: (event: any) => void;
  size: Size;
}) => {
  const height = getHeight(size);
  return (
    <div
      onClick={onClick}
      className="border-2 border-white rounded-md hover:cursor-pointer hover:border-blue-400 hover:shadow-lg"
    >
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        className={`h-${height} pl-0.5 pt-0.5 pr-0.5`}
      >
        <path
          d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
			c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
			C514.5,101.703,514.499,85.494,504.502,75.496z"
          className="fill-blue-700"
        ></path>
      </svg>
    </div>
  );
};

export function RenderService(
  service: ServiceElement,
  onClick: () => void,
  onCommit: () => void
) {
  if (service.status !== "deleted") {
    return (
      <RenderSideBarElement
        key={service.id}
        name={service.name}
        status={service.status}
        icon={"/computer-networks.svg"}
        alt={"service"}
        onClick={() => onClick()}
        onClickCheck={() => onCommit()}
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
      return "border-blue-500 border-2 ";
    case "new":
      return "border-green-500 border-2";
    case "deleted":
      return "display-none";
    case "source":
      return "border-gray-200 border-2 hover:border-blue-500";
  }
};
