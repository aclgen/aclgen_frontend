import { useDroppable } from "@dnd-kit/core";
import React, {
  createRef,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  removeDraggedItem,
  selectDraggable,
} from "../../features/draggable/draggableSlice";
import {
  initiateNewService,
  selectService,
} from "../../features/service/DraftServiceSlice";
import { NetworkObjectElement, ServiceElement } from "../../types/types";
import { XIcon } from "../creationForm/PopUpForm";
import { PlusButtonSVG } from "../PLusButton";
import { Label } from "../rule/RuleCard";
import { CheckIconSVG, statusStyle } from "../SelectableElement/SideBarElement";

export interface DroppableFieldProps {
  Children?: typeof React.Component;
  id: string;
  droppableType: "object" | "service";
}

export const DroppableField = ({ id }: DroppableFieldProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const dispatch = useAppDispatch();

  const [searchInput, setSearchInput] = useState("");

  const { searchMenu, isOpen, setOpen } = useCloseOnLostFocus();

  const { inputElements, addElement, removeElement, searchName } =
    useSearchElement(id);

  return (
    <div
      ref={setNodeRef}
      className="relative hover:cursor-text"
      onClick={() => {
        setOpen(true);
      }}
    >
      <Label value="TESTDROP" />
      <div className={composeStyle(isOver)}>
        {inputElements.map((element) => (
          <Element
            key={element}
            name={element}
            onRemove={removeElement}
            disableRemove={inputElements.length > 1}
          />
        ))}
      </div>
      {isOpen ? (
        <div ref={searchMenu} className={`w-50 ${composeStylePlus(isOver)} `}>
          <div>
            <input
              type="source"
              name="source"
              id="SOURCETEST"
              autoFocus={true}
              autoComplete="off"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className={
                "outline-none border-none m-0 text-md w-full p-1 border-b border-gray-300 h-8 inline bg-gray-50"
              }
            />
          </div>
          <SearchResults
            isAdded={(name) => {
              return inputElements.includes(name);
            }}
            searchResults={searchName(searchInput)}
            addElement={addElement}
            onCreateNew={(string) => dispatch(initiateNewService())}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export function useCloseOnLostFocus() {
  const searchMenu = useRef(null);

  const [isOpen, setOpen] = useState(false);

  const closeOpenMenus = (e) => {
    if (
      searchMenu.current &&
      isOpen &&
      !searchMenu.current.contains(e.target)
    ) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", closeOpenMenus);

  return { searchMenu, isOpen, setOpen };
}

export function useSearchElement(id: string) {
  const dispatch = useAppDispatch();
  const draggableState = useAppSelector(selectDraggable);
  const useServiceState = useAppSelector(selectService);

  useEffect(() => {
    if (
      draggableState.currentDroppedItem !== undefined &&
      draggableState.currentDroppedItem.target === id
    ) {
      const match = searchId(draggableState.currentDroppedItem.dropped);
      if (match !== undefined) {
        addElement(match.name);
        dispatch(removeDraggedItem());
      }
    }
  }, [draggableState.currentDroppedItem]);

  function searchName(input: string) {
    if (input === "" || input === undefined) {
      return [];
    } else {
      return useServiceState.services.filter((element) =>
        element.name.toLowerCase().includes(input.toLowerCase())
      );
    }
  }

  function searchId(id: string) {
    if (id === "" || id === undefined) {
      return undefined;
    } else {
      return useServiceState.services.find((element) => element.id === id);
    }
  }

  const [inputElements, setInputElements] = useState(["HTTP"]);

  function removeElement(name: string) {
    if (inputElements.length > 1) {
      setInputElements(
        inputElements.filter(
          (element) => element.toLowerCase() !== name.toLowerCase()
        )
      );
    }
  }

  function addElement(name: string) {
    const element = inputElements.filter(
      (element) => element.toLowerCase() === name.toLowerCase()
    );

    if (element.length === 0) {
      setInputElements([...inputElements, name]);
    } else {
      removeElement(name);
    }
  }

  return { inputElements, addElement, removeElement, searchName };
}

export function SearchResults({
  searchResults,
  addElement,
  isAdded,
  onCreateNew,
}: {
  searchResults: ServiceElement[];
  addElement: (name: string) => void;
  isAdded: (name: string) => boolean;
  onCreateNew: (name: string) => void;
}) {
  return (
    <ul className="flex flex-col w-full flex-wrap border-t border-gray-200 space-y-1 ">
      {searchResults.map((element, i) => {
        return (
          <li
            key={element.id}
            onClick={() => {
              addElement(element.name);
            }}
            className="hover:bg-blue-500 group p-2 hover:text-white w-full hover:cursor-pointer"
          >
            <div className="flex flex-row">
              <p>{element.name}</p>
              {isAdded(element.name) ? (
                <div className="ml-auto pr-1">
                  <CheckIconSVG size="sm" />
                </div>
              ) : (
                ""
              )}
            </div>
          </li>
        );
      })}
      {searchResults.length === 0 ? (
        <li
          key={"new"}
          onClick={() => {
            addElement("new");
            onCreateNew("new");
          }}
          className="hover:bg-blue-500 p-2 hover:text-white w-full hover:cursor-pointer"
        >
          <div className="flex flex-row items-center">
            <p>create new</p>

            <div className="ml-auto">
              <PlusButtonSVG />
            </div>
          </div>
        </li>
      ) : (
        <></>
      )}
    </ul>
  );
}

export function Element({
  name,
  onRemove,
  disableRemove,
}: {
  name: string;
  onRemove: (name) => void;
  disableRemove: boolean;
}) {
  return (
    <div
      key={name}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`flex flex-row bg-white space-x-2 hover:cursor-pointer hover:shadow-lg transition-shadow  ${statusStyle(
        "source"
      )} outline-none shadow-md items-center px-2 py-1 rounded-md`}
    >
      <p className="text-md select-none text-gray-700 ">{name}</p>
      <div className="ml-auto">
        {disableRemove ? (
          <XIcon
            onClick={(e) => {
              e.stopPropagation();
              onRemove(name);
            }}
            size="sm"
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function composeStyle(isHovering: boolean): string {
  const baseStyle =
    "bg-gray-50 flex flex-row flex-wrap outline-none hover:cursor-text h-auto block p-1 w-32 rounded-lg overflow-wrap";

  const text = "text-gray-900 text-sm";

  const border = `border-2 ${
    isHovering ? "border-blue-500" : "border-gray-300"
  } hover:border-blue-500 active:border-blue-500`;

  return `${baseStyle} ${text} ${border} `;
}

function composeStylePlus(isHovering: boolean): string {
  const baseStyle =
    "bg-gray-50 absolute pt-2 flex flex-col flew-wrap mt-1 min-h-20 w-56 h-fit z-50 flex flex-row outline-none rounded-lg";

  const text = "text-gray-900 text-sm";

  const border = `border-2 ${
    isHovering ? "border-blue-500" : "border-gray-300"
  } hover:border-blue-500 active:border-blue-500`;

  return `${baseStyle} ${text} ${border} `;
}
