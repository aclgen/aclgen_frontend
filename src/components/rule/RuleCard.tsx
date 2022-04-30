import { useEffect, useState } from "react";
import {
  DIRECTION,
  IPV4,
  NetworkObjectElement,
  POLICY,
  Rule,
  PortService,
  ServiceElement,
  EditableElement,
} from "../../types/types";
import { statusStyle } from "../SelectableElement/SideBarElement";
import { useDroppable } from "@dnd-kit/core";
import { DroppableInputField } from "../InputField/DroppableField";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  initiateNewService,
  initiatePopUp,
  selectService,
} from "../../features/service/DraftServiceSlice";
import {
  initiateNewObject,
  selectNetworkObjects,
} from "../../features/networkObject/DraftNetworkObjectSlice";
import { selectDraggable } from "../../features/draggable/draggableSlice";
import Image from "next/image";

export interface CardProps {
  index: number;
  rule: Rule;
  modifyCard: (rule: Rule) => void;
}

export interface DragItem {
  index: number;
  id: string;
  type: string;
}

export const ItemTypes = {
  CARD: "card",
};

/**
 *
 * @param key index of the Rule
 * @returns A properly formatted Rule card
 */
function Card({ index, rule, modifyCard }: CardProps) {
  const searchAbleElements = useAppSelector(selectService).services;
  const dragState = useAppSelector(selectDraggable).currentDraggedItem;
  const searchAbleObjects = useAppSelector(selectNetworkObjects).networkObjects;
  const dispatch = useAppDispatch();

  const [name, setName] = useState(rule.name);
  const [comment, setComment] = useState(rule.comment);
  const [source, setSource] = useState(rule.sources);
  const [destination, setDestination] = useState(rule.destinations);
  const [direction, setDirection] = useState(rule.direction);
  const [service, setService] = useState(rule.services);
  const [policy, setPolicy] = useState(rule.policy);
  const [status, setStatus] = useState(rule.status);

  function onChange(setState: () => void) {
    setState();
    modifyCard(createCard());
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (name !== rule.name || comment !== rule.comment) {
        modifyCard(createCard());
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, comment]);

  function createCard(): Rule {
    return {
      sources: source,
      destinations: destination,
      device: rule.device,
      services: service,
      direction: direction,
      policy: policy,
      name: name,
      comment: comment,
      status: status === "new" ? "new" : "modified",
      id: rule.id,
    };
  }

  return (
    <div
      key={rule.id}
      className={`p-2 pl-4 container bg-white container-xl transition-opacity ${statusStyle(
        rule.status
      )} mb-2 hover:cursor-pointer outline-none active:border-blue-500 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700 min-w-fit`}
    >
      <form
        className="space-y-2 flex flex-row justify-between space-x-4"
        action="#"
      >
        <div className="space-y-2 flex justify-self-start flex-row justify-between space-x-4 ">
          <Index value={index} />
          <Name
            value={name}
            onChange={(data) => {
              setName(data);
            }}
          />
          <DroppableInputField
            droppableType={"object"}
            inputID={rule.id + "sourceinput"}
            fieldType={"SOURCE"}
            elements={source}
            searchAbleElements={searchAbleObjects}
            onCreateNewElement={(name: string) => {
              dispatch(initiatePopUp());
              dispatch(initiateNewObject(name));
            }}
            onUpdateElements={(elements: NetworkObjectElement[]) => {
              onChange(() => setSource(elements));
            }}
            disabled={dragState !== undefined && dragState.type !== "object"}
          />
          <DroppableInputField
            droppableType={"object"}
            inputID={rule.id + "destinationinput"}
            fieldType={"DESTINATION"}
            elements={destination}
            searchAbleElements={searchAbleObjects}
            onCreateNewElement={(name: string) => {
              dispatch(initiatePopUp());
              dispatch(initiateNewObject(name));
            }}
            onUpdateElements={(elements: NetworkObjectElement[]) => {
              onChange(() => setDestination(elements));
            }}
            disabled={dragState !== undefined && dragState.type !== "object"}
          />
          <DroppableInputField
            droppableType={"service"}
            inputID={rule.id + "serviceinput"}
            fieldType={"SERVICE"}
            elements={service}
            searchAbleElements={searchAbleElements}
            onCreateNewElement={(name: string) => {
              dispatch(initiatePopUp());
              dispatch(initiateNewService({ name: name }));
            }}
            onUpdateElements={(elements: ServiceElement[]) => {
              onChange(() => setService(elements));
            }}
            disabled={dragState !== undefined && dragState.type !== "service"}
          />
          <Direction
            value={direction}
            onChange={(data: DIRECTION) => {
              onChange(() => setDirection(data));
            }}
          />
          <Policy
            value={policy}
            onChange={(data: POLICY) => {
              onChange(() => setPolicy(data));
            }}
          />
          <Comment
            value={comment}
            onChange={(data) => {
              setComment(data);
            }}
          />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon />
          <LockIcon />
          <BoxIcon />
          <DragIcon />
        </div>
      </form>
    </div>
  );
}

function composeStyle(isHovering: boolean): string {
  const baseStyle = "bg-gray-50 outline-none block p-2.5 w-32 rounded-lg";

  const text = "text-gray-900 text-sm";

  const border = `border-2 ${
    isHovering ? "border-blue-500" : "border-gray-300"
  } hover:border-blue-500 active:border-blue-500`;

  return `${baseStyle} ${text} ${border} `;
}

export const defaultClass: string =
  "bg-gray-50 outline-none border-2 border-gray-300 w-32 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white";

export const defaultClassPlaceholder: string =
  "bg-gray-50 animate-pulse outline-none border-2 bg-gray-300 border-gray-300 w-32 text-gray-900 text-sm rounded-lg  focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white";

export const Index: React.FC<{ value: number }> = ({ value }) => (
  <p className="block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white">
    {`#${value}`}
  </p>
);

export const BoxIcon = () => {
  return (
    <div className="relative">
      <Image
        src="/square.svg"
        layout="fill"
        className=" mr-3 h-6"
        alt="checkbox"
      />
    </div>
  );
};

export const DragIcon = () => {
  return (
    <div className="relative mr-3 h-6">
      <Image src="/hamburger_menu.svg" layout="fill" alt="dragIcon" />
    </div>
  );
};

export const LockIcon = () => {
  return (
    <div className="relative mr-3 h-6">
      <Image src="/locked.svg" layout="fill" alt="locked" />
    </div>
  );
};

export const CheckIcon = () => {
  return (
    <div className="relative mr-3 h-6">
      <Image src="/tick.svg" layout="fill" alt="tickbox" />
    </div>
  );
};

export const Name = ({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label value="Name" />
    <input
      type="name"
      name="Name"
      id="name"
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={defaultClass}
      placeholder="Rule Name..."
      required
    />
  </div>
);

export const PlaceholderName = ({}: {}) => (
  <div>
    <Label value="Name" />
    <input
      type="placeholder"
      name="placeholder"
      id="placeholder"
      disabled={true}
      value={""}
      className={defaultClassPlaceholder}
      placeholder="..."
    />
  </div>
);

export const Source = ({
  value,
  parentId,
  onChange,
}: {
  value: NetworkObjectElement;
  parentId: string;
  onChange: (NetworkObjectElement: NetworkObjectElement) => void;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: value.id,
    data: {
      id: parentId,
    },
  });
  return (
    <div ref={setNodeRef} className={`mt-2`}>
      <Label value="SOURCE" />
      <input
        type="source"
        name="source"
        id="source"
        value={value.name}
        onChange={(event) => {
          onChange({ ...value, name: event.target.value });
        }}
        placeholder="192.168.x.x"
        className={composeStyle(isOver)}
        required
      />
    </div>
  );
};

export const Destination = ({
  value,
  onChange,
}: {
  value: NetworkObjectElement;
  onChange: (NetworkObjectElement: NetworkObjectElement) => void;
}) => (
  <div>
    <Label value="DESTINATION" />
    <input
      type="destination"
      name="service"
      id="service"
      onChange={(event) => {
        onChange({ ...value, name: event.target.value });
      }}
      value={value.name}
      placeholder="HTTP/80"
      className={defaultClass}
      required
    />
  </div>
);

export const ServiceInput = ({
  value,
  onChange,
}: {
  value: ServiceElement;
  onChange: (serviceElement: ServiceElement) => void;
}) => (
  <div>
    <Label value="SERVICE" />
    <input
      type="service"
      name="service"
      id="service"
      value={value.name}
      onChange={(event) => {
        onChange({
          ...value,
          name: event.target.value,
        });
      }}
      placeholder="HTTP/80"
      className={defaultClass}
      required
    />
  </div>
);

export const Direction = ({
  value,
  onChange,
}: {
  value: DIRECTION;
  onChange: (direction: DIRECTION) => void;
}) => (
  <div>
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      DIRECTION
    </label>
    <select
      name="direction"
      id="direction"
      placeholder="incoming"
      className="bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
      value={value}
      onChange={(event) => onChange(DIRECTION[event.target.value])}
    >
      <option value={DIRECTION.INBOUND}>INCOMING</option>
      <option value={DIRECTION.OUTBOUND}>OUTGOING</option>
    </select>
  </div>
);

export const Policy = ({
  value,
  onChange,
}: {
  value: POLICY;
  onChange: (policy: POLICY) => void;
}) => (
  <div>
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      POLICY
    </label>
    <select
      name="policy"
      id="policy"
      placeholder="DENY"
      className="bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
      value={value}
      onChange={(event) => onChange(POLICY[event.target.value])}
    >
      <option value={POLICY.ACCEPT}>ACCEPT</option>
      <option value={POLICY.DENY}>DENY</option>
    </select>
  </div>
);

export const Comment = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="max-w-fit">
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      Comment
    </label>
    <textarea
      name="comment"
      id="comment"
      placeholder=""
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="bg-gray-50 border border-gray-300 resize-x text-gray-900 text-sm rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
    />
  </div>
);

export const Label = ({ value }: { value: string }) => (
  <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
    {value}
  </label>
);

export default Card;
