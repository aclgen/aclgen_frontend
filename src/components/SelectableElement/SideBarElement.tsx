import { NetworkElement, FireWall } from "../../types/repository";
import {
  ServiceElement,
  NetworkObjectElement,
  EditableElementStatus,
} from "../../types/types";
import { createPortal } from "react-dom";
import { getHeight, Size } from "../creationForm/PopUpForm";
import {
  useDraggable,
  DragOverlay,
  useDndMonitor,
  DragStartEvent,
  DragCancelEvent,
} from "@dnd-kit/core";
import { ReactNode, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import {
  addDraggedItem,
  startDragging,
  stopDragging,
} from "../../features/draggable/draggableSlice";
import { Simulate } from "react-dom/test-utils";
import contextMenu = Simulate.contextMenu;

export interface SideBarElementProps {
  type: "service" | "object";
  name: string;
  icon: string;
  id: string;
  alt: string;
  status: "source" | "new" | "modified" | "deleted";
  onClick: () => void;
  contextMenu?: () => void;
  onClickCheck?: () => void;
}

export function RenderSideBarElement({
  element,
}: {
  element: SideBarElementProps;
}) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        element.onClick();
      }}
      onContextMenu={element.contextMenu}
      key={element.id}
      className={`flex flex-row bg-white group hover:cursor-pointer hover:shadow-lg transition-shadow  ${statusStyle(
        element.status
      )} outline-none  h-10 shadow-md items-center px-4 rounded-md`}
    >
      <img className="h-5" src={element.icon} alt={element.alt} />
      <p className="text-md select-none text-gray-700  pl-2">{element.name}</p>
      <div className="ml-auto flex flex-row pl-2 space-x-1">
        <EditIcon
          onClick={(e) => {
            e.stopPropagation();
            element.onClick();
          }}
          size="md"
        />
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

export function DraggableSideBarElement({
  element,
}: {
  element: SideBarElementProps;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useAppDispatch();

  useDndMonitor({
    onDragStart(event) {
      handleDragStart(event);
    },

    onDragEnd(event) {
      handleDragEnd(event);
    },
    onDragCancel(event) {
      handleDragCancel(event);
    },
  });

  function handleDragStart(event: DragStartEvent) {
    if (event.active.id === element.id) {
      setIsDragging(true);
      dispatch(startDragging({ id: element.id, type: element.type }));
    }
  }

  function handleDragCancel(event: DragCancelEvent) {
    setIsDragging(false);
    dispatch(stopDragging());
  }

  function handleDragEnd(event) {
    setIsDragging(false);
    dispatch(stopDragging());
    const { active, over } = event;

    if (
      active.data.current === null ||
      over === null ||
      event.active.id !== element.id
    ) {
      return;
    }

    dispatch(
      addDraggedItem({
        dropped: { id: active.data.current.id, type: element.type },
        target: over.id,
      })
    );
  }

  return (
    <>
      <Draggable id={element.id} type={element.type}>
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
  type: "object" | "service";
}

function Draggable(draggable: DraggableProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: draggable.id,
    data: {
      id: draggable.id,
      type: draggable.type,
    },
  });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {draggable.children}
    </div>
  );
}

export const EditIcon = ({
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
      className="rounded-md border-2 border-white hover:border-gray-300 hover:cursor-pointer group-hover:opacity-100 duration-75 transition-opacity ease-in  opacity-0 hover:shadow-lg"
    >
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 368 368"
        className={`h-${height} p-0.5 fill-gray-500`}
      >
        <g>
          <g>
            <path
              d="M344,144h-29.952c-2.512-8.2-5.8-16.12-9.792-23.664l21.16-21.16c4.528-4.528,7.024-10.56,7.024-16.984
			c0-6.416-2.496-12.448-7.024-16.976l-22.64-22.64c-9.048-9.048-24.888-9.072-33.952,0l-21.16,21.16
			c-7.536-3.992-15.464-7.272-23.664-9.792V24c0-13.232-10.768-24-24-24h-32c-13.232,0-24,10.768-24,24v29.952
			c-8.2,2.52-16.12,5.8-23.664,9.792l-21.168-21.16c-9.36-9.36-24.592-9.36-33.952,0l-22.648,22.64
			c-9.352,9.36-9.352,24.592,0,33.952l21.16,21.168c-3.992,7.536-7.272,15.464-9.792,23.664H24c-13.232,0-24,10.768-24,24v32
			C0,213.232,10.768,224,24,224h29.952c2.52,8.2,5.8,16.12,9.792,23.664l-21.16,21.168c-9.36,9.36-9.36,24.592,0,33.952
			l22.64,22.648c9.36,9.352,24.592,9.352,33.952,0l21.168-21.16c7.536,3.992,15.464,7.272,23.664,9.792V344
			c0,13.232,10.768,24,24,24h32c13.232,0,24-10.768,24-24v-29.952c8.2-2.52,16.128-5.8,23.664-9.792l21.16,21.168
			c9.072,9.064,24.912,9.048,33.952,0l22.64-22.64c4.528-4.528,7.024-10.56,7.024-16.976c0-6.424-2.496-12.448-7.024-16.976
			l-21.16-21.168c3.992-7.536,7.272-15.464,9.792-23.664H344c13.232,0,24-10.768,24-24v-32C368,154.768,357.232,144,344,144z
			 M352,200c0,4.408-3.584,8-8,8h-36c-3.648,0-6.832,2.472-7.744,6c-2.832,10.92-7.144,21.344-12.832,30.976
			c-1.848,3.144-1.344,7.144,1.232,9.72l25.44,25.448c1.504,1.504,2.336,3.512,2.336,5.664c0,2.152-0.832,4.16-2.336,5.664
			l-22.64,22.64c-3.008,3.008-8.312,3.008-11.328,0l-25.44-25.44c-2.576-2.584-6.576-3.08-9.728-1.232
			c-9.616,5.68-20.04,10-30.968,12.824c-3.52,0.904-5.992,4.088-5.992,7.736v36c0,4.408-3.584,8-8,8h-32c-4.408,0-8-3.592-8-8v-36
			c0-3.648-2.472-6.832-6-7.744c-10.92-2.824-21.344-7.136-30.976-12.824c-1.264-0.752-2.664-1.112-4.064-1.112
			c-2.072,0-4.12,0.8-5.664,2.344l-25.44,25.44c-3.128,3.12-8.2,3.12-11.328,0l-22.64-22.64c-3.128-3.128-3.128-8.208,0-11.328
			l25.44-25.44c2.584-2.584,3.088-6.584,1.232-9.72c-5.68-9.632-10-20.048-12.824-30.976c-0.904-3.528-4.088-6-7.736-6H24
			c-4.408,0-8-3.592-8-8v-32c0-4.408,3.592-8,8-8h36c3.648,0,6.832-2.472,7.744-6c2.824-10.92,7.136-21.344,12.824-30.976
			c1.856-3.144,1.352-7.144-1.232-9.72l-25.44-25.44c-3.12-3.12-3.12-8.2,0-11.328l22.64-22.64c3.128-3.128,8.2-3.12,11.328,0
			l25.44,25.44c2.584,2.584,6.576,3.096,9.72,1.232c9.632-5.68,20.048-10,30.976-12.824c3.528-0.912,6-4.096,6-7.744V24
			c0-4.408,3.592-8,8-8h32c4.416,0,8,3.592,8,8v36c0,3.648,2.472,6.832,6,7.744c10.928,2.824,21.352,7.144,30.968,12.824
			c3.152,1.856,7.152,1.36,9.728-1.232l25.44-25.44c3.016-3.024,8.32-3.016,11.328,0l22.64,22.64
			c1.504,1.504,2.336,3.52,2.336,5.664s-0.832,4.16-2.336,5.664l-25.44,25.44c-2.576,2.584-3.088,6.584-1.232,9.72
			c5.688,9.632,10,20.048,12.832,30.976c0.904,3.528,4.088,6,7.736,6h36c4.416,0,8,3.592,8,8V200z"
            />
          </g>
        </g>
        <g>
          <g>
            <path
              d="M184,112c-39.696,0-72,32.304-72,72s32.304,72,72,72c39.704,0,72-32.304,72-72S223.704,112,184,112z M184,240
			c-30.88,0-56-25.12-56-56s25.12-56,56-56c30.872,0,56,25.12,56,56S214.872,240,184,240z"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};

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
      />
    </svg>
  );
};

export function RenderService(
  service: ServiceElement,
  onClick: () => void,
  onCommit: () => void,
  contextMenu?: () => void
) {
  const elementProps: SideBarElementProps = {
    ...service,
    icon: "/computer-networks.svg",
    alt: "Service",
    onClick: onClick,
    onClickCheck: onCommit,
    contextMenu,
    type: "service",
  };
  if (service.status !== "deleted") {
    return <DraggableSideBarElement element={elementProps} />;
  } else {
    return <></>;
  }
}

export function RenderNetworkObjects(
  element: NetworkObjectElement,
  onClick: () => void,
  onCommit: () => void,
  contextMenu?: () => void
) {
  const elementProps: SideBarElementProps = {
    ...element,
    icon: "/server.svg",
    alt: "Host",
    onClick: onClick,
    onClickCheck: onCommit,
    type: "object",
    contextMenu,
  };
  if (element.status !== "deleted") {
    return <DraggableSideBarElement element={elementProps} />;
  } else {
    return <></>;
  }
}

export function RenderNetworkElement(
  element: NetworkElement,
  onClick: () => void
) {
  switch (element.type) {
    case "FIREWALL": {
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
  const element: SideBarElementProps = {
    ...fireWall,
    icon: "/firewall.svg",
    alt: "firewall",
    onClick: () => {},
    type: "object",
  };

  return <RenderSideBarElement element={element} />;
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
