import { NetworkElement, FireWall } from "../../types/repository";
import {
  ServiceElement,
  NetworkObjectElement,
  EditableElementStatus,
  Rule,
} from "../../types/types";
import { createPortal } from "react-dom";
import { getHeight, Size } from "../creationForm/PopUpForm";
import {
  useDraggable,
  DragOverlay,
  useDndMonitor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addDraggedItem } from "../../features/draggable/draggableSlice";

export interface SideBarElementProps {
  name: string;
  icon: string;
  id: string;
  alt: string;
  status: "source" | "new" | "modified" | "deleted";
  onClick: () => void;
  onClickCheck?: () => void;
}

export function RenderSideBarElement({
  element,
}: {
  element: SideBarElementProps;
}) {
  return (
    <div
      key={element.name}
      onClick={element.onClick}
      className={`flex flex-row bg-white  hover:cursor-pointer hover:shadow-lg transition-shadow  ${statusStyle(
        element.status
      )} outline-none  h-10 shadow-md items-center px-4 rounded-md`}
    >
      <img className="h-5" src={element.icon} alt={element.alt} />
      <p className="text-md select-none text-gray-700  pl-2">{element.name}</p>
      <div className="ml-auto">
        {element.status !== "source" ? (
          <CheckIcon
            onClick={(e) => {
              e.stopPropagation();
              element.onClickCheck();
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

function DraggableService({ element }: { element: SideBarElementProps }) {
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useAppDispatch();

  useDndMonitor({
    onDragStart(event) {
      handleDragStart();
    },

    onDragEnd(event) {
      handleDragEnd(event);
    },
    onDragCancel(event) {
      setIsDragging(false);
    },
  });

  function handleDragStart() {
    setIsDragging(true);
  }

  function handleDragEnd(event) {
    setIsDragging(false);
    const { active, over } = event;

    if (active.data.current === null || over === null) {
      return;
    }

    dispatch(
      addDraggedItem({
        dropped: active.data.current.id,
        target: over.id,
      })
    );
  }

  return (
    <>
      <Draggable id={element.id}>
        <RenderSideBarElement element={element} />
      </Draggable>
      {createPortal(
        <DragOverlay dropAnimation={null}>
          {isDragging ? <RenderSideBarElement element={element} /> : null}
        </DragOverlay>,
        document.body
      )}
    </>
  );
}

export interface DraggableProps {
  children: ReactNode;
  id: string;
}

function Draggable(draggable: DraggableProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: draggable.id,
    data: {
      id: draggable.id,
    },
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {draggable.children}
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

export const CheckIconSVG = ({
  size = "md",
  isHovering = false,
}: {
  size: Size;
  isHovering: boolean;
}) => {
  const height = getHeight(size);
  return (
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
        className={` group-hover:fill-white ${
          isHovering ? "fill-white" : "fill-blue-700"
        }`}
      ></path>
    </svg>
  );
};

export function RenderService(
  service: ServiceElement,
  onClick: () => void,
  onCommit: () => void
) {
  const elementProps = {
    ...service,
    icon: "/computer-networks.svg",
    alt: "Service",
    onClick: onClick,
    onClickCheck: onCommit,
  };
  if (service.status !== "deleted") {
    return <DraggableService element={elementProps} />;
  }
}

export function RenderNetworkObjects(
  element: NetworkObjectElement,
  onClick: () => void
): any {
  const elementProps = {
    ...element,
    icon: "/server.svg",
    alt: "Host",
    onClick: onClick,
  };
  if (element.status !== "deleted") {
    return <RenderSideBarElement key={element.id} element={elementProps} />;
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
  const element = {
    ...fireWall,
    icon: "/firewall.svg",
    alt: "firewall",
    onClick: () => {},
  };

  return <RenderSideBarElement key={fireWall.id} element={element} />;
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
      return "border-gray-200 border-2 hover:border-blue-500 outline-none active:outline-none";
  }
};
