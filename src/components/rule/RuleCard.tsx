import { FC, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord, Identifier } from "dnd-core";
import {
  DIRECTION,
  IPV4,
  NetworkObjectElement,
  POLICY,
  Rule,
  RuleElement,
  Service,
  ServiceElement,
} from "../../types/types";

export interface CardProps {
  index: number;
  rule: Rule;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
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
function card({ index, rule, moveCard }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const cardKey = rule.id;

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { cardKey, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      key={rule.id}
      ref={ref}
      data-handler-id={handlerId}
      className={`p-2 ${
        opacity === 0 ? "opacity-0" : "opacity-100"
      } pl-4 container bg-white container-xl transition-shadow transition-opacity hover:cursor-pointer active:border-cyan-800 hover:border-cyan-600 hover:shadow-lg rounded-md border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700`}
    >
      <form
        className="space-y-2 flex flex-row justify-between space-x-4"
        action="#"
      >
        <div className="space-y-2 flex justify-self-start flex-row justify-between space-x-4 ">
          <Index value={index} />
          <Name value={rule.name} />
          <Source value={rule.source} />
          <Destination value={rule.destination} />
          <Service value={rule.service} />
          <Direction value={rule.direction} />
          <Policy value={rule.policy} />
          <Comment value={rule.comment} />
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

const defaultClass: string =
  "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white";

const Index: React.FC<{ value: number }> = ({ value }) => (
  <p className="block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white">
    {`#${value}`}
  </p>
);

const BoxIcon = () => {
  return (
    <div>
      <img src="/square.svg" className=" mr-3 h-6" />
    </div>
  );
};

const DragIcon = () => {
  return (
    <div>
      <img src="/hamburger_menu.svg" className=" mr-3 h-6" />
    </div>
  );
};

const LockIcon = () => {
  return (
    <div>
      <img src="/locked.svg" className=" mr-3 h-6" />
    </div>
  );
};

const CheckIcon = () => {
  return (
    <div>
      <img src="/tick.svg" className=" mr-3 h-6" />
    </div>
  );
};

const Name = ({ value }: { value: string }) => (
  <div>
    <Label value="Name" />
    <input
      type="email"
      name="email"
      id="email"
      value={value}
      onChange={() => {}}
      className={defaultClass}
      placeholder="Rule name..."
      required
    />
  </div>
);

const Source = ({ value }: { value: NetworkObjectElement }) => (
  <div className="mt-2">
    <Label value="SOURCE" />
    <input
      type="source"
      name="source"
      id="source"
      value={value.name}
      onChange={() => {}}
      placeholder="192.168.x.x"
      className={defaultClass}
      required
    />
  </div>
);

const Destination = ({ value }: { value: NetworkObjectElement }) => (
  <div>
    <Label value="DESTINATION" />
    <input
      type="destination"
      name="service"
      id="service"
      onChange={() => {}}
      value={value.name}
      placeholder="HTTP/80"
      className={defaultClass}
      required
    />
  </div>
);

const Service = ({ value }: { value: ServiceElement }) => (
  <div>
    <Label value="SERVICE" />
    <input
      type="service"
      name="service"
      id="service"
      value={value.name}
      onChange={() => {}}
      placeholder="HTTP/80"
      className={defaultClass}
      required
    />
  </div>
);

const Direction = ({ value }: { value: DIRECTION }) => (
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
    >
      <option value="incoming">INCOMING</option>
      <option value="outgoing">OUTGOING</option>
    </select>
  </div>
);

const Policy = ({ value }: { value: POLICY }) => (
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
    >
      <option value="allow">ALLOW</option>
      <option value="deny">DENY</option>
    </select>
  </div>
);

const Comment = ({ value }: { value: string }) => (
  <div className="max-w-fit">
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      Comment
    </label>
    <textarea
      name="comment"
      id="comment"
      placeholder="..."
      className="bg-gray-50 border resize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
    />
  </div>
);

const Label = ({ value }: { value: string }) => (
  <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
    {value}
  </label>
);

export default card;
