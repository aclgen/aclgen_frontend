import { useState } from "react";
import {
  DIRECTION,
  IPV4,
  NetworkObjectElement,
  POLICY,
  Rule,
  PortService,
  ServiceElement,
} from "../../types/types";
import { statusStyle } from "../SelectableElement/SideBarElement";
import { useDroppable } from "@dnd-kit/core";

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
function card({ index, rule, modifyCard }: CardProps) {
  const [name, setName] = useState(rule.name);
  const [comment, setComment] = useState(rule.comment);
  const [source, setSource] = useState(rule.source);
  const [destination, setDestination] = useState(rule.destination);
  const [direction, setDirection] = useState(rule.direction);
  const [service, setService] = useState(rule.service);
  const [policy, setPolicy] = useState(rule.policy);
  const [status, setStatus] = useState(rule.status);

  function onChange(setState: () => void) {
    setState();
    modifyCard(createCard());
  }

  function createCard(): Rule {
    return {
      source: source,
      destination: destination,
      service: service,
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
      className={`p-2  pl-4 container bg-white container-xl transition-opacity ${statusStyle(
        rule.status
      )} hover:cursor-pointer outline-none active:border-blue-500 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700`}
    >
      <form
        className="space-y-2 flex flex-row justify-between space-x-4"
        action="#"
      >
        <div className="space-y-2 flex justify-self-start flex-row justify-between space-x-4 ">
          <Index value={index} />
          <Name
            value={rule.name}
            onChange={(data) => {
              onChange(() => setName(data));
            }}
          />
          <Source
            value={rule.source}
            parentId={rule.id}
            onChange={(data: IPV4) => {
              onChange(() => setSource(data));
            }}
          />
          <Destination
            value={destination}
            onChange={(data: IPV4) => {
              onChange(() => setDestination(data));
            }}
          />
          <ServiceInput
            value={service}
            onChange={(data: PortService) => {
              onChange(() => setService(data));
            }}
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
              onChange(() => setComment(data));
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

export const Index: React.FC<{ value: number }> = ({ value }) => (
  <p className="block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white">
    {`#${value}`}
  </p>
);

export const BoxIcon = () => {
  return (
    <div>
      <img src="/square.svg" className=" mr-3 h-6" />
    </div>
  );
};

export const DragIcon = () => {
  return (
    <div>
      <img src="/hamburger_menu.svg" className=" mr-3 h-6" />
    </div>
  );
};

export const LockIcon = () => {
  return (
    <div>
      <img src="/locked.svg" className=" mr-3 h-6" />
    </div>
  );
};

export const CheckIcon = () => {
  return (
    <div>
      <img src="/tick.svg" className=" mr-3 h-6" />
    </div>
  );
};

export const Name = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label value="Name" />
    <input
      type="name"
      name="Name"
      id="name"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={defaultClass}
      placeholder="Rule Name..."
      required
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

export default card;
