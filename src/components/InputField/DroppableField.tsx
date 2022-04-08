import { useDroppable } from "@dnd-kit/core";
import React, {
  ReactNode,
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
import { ServiceElement } from "../../types/types";
import { XIcon } from "../creationForm/PopUpForm";
import { PlusButtonSVG } from "../PLusButton";
import { Label } from "../rule/RuleCard";
import { CheckIconSVG, statusStyle } from "../SelectableElement/SideBarElement";

export const ServiceInputField = ({ id }: { id: string }) => {};

export interface DroppableFieldProps {
  Children?: typeof React.Component;
  isOver?: boolean;
  id: string;
  droppableType: "object" | "service";
}
export const DroppableField = ({ id }: DroppableFieldProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const { searchMenu, isOpen, setOpen } = useCloseOnLostFocus();

  const { inputElements, addElement, removeElement, searchName } =
    useSearchElement(id);

  function isElementPresent(name: string) {
    return inputElements.includes(name);
  }

  return (
    <div
      ref={setNodeRef}
      className="relative hover:cursor-text"
      onClick={() => {
        setOpen(true);
      }}
    >
      <Label value="TESTDROP" />
      <FlexibleInputContainer
        isHovered={isOver}
        inputElements={inputElements}
        removeElement={removeElement}
      />
      <If condition={isOpen}>
        <SearchInput
          searchRef={searchMenu}
          isElementPresent={isElementPresent}
          search={searchName}
          addElement={addElement}
        />
      </If>
    </div>
  );
};

function FlexibleInputContainer({
  isHovered,
  inputElements,
  removeElement,
}: {
  isHovered: boolean;
  inputElements: string[];
  removeElement: (name: string) => void;
}) {
  return (
    <div className={composeStyle(isHovered)}>
      {inputElements.map((element) => (
        <ElementSearchInput
          key={element}
          name={element}
          onRemove={removeElement}
          disableRemove={inputElements.length > 1}
        />
      ))}
    </div>
  );
}
interface SearchInputProps {
  searchRef: React.MutableRefObject<any>;
  isElementPresent: (name: string) => boolean;
  search: (input: string) => ServiceElement[];
  addElement: (name: string) => void;
}

function SearchInput({
  searchRef,
  isElementPresent,
  search,
  addElement,
}: SearchInputProps) {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState("");

  const searchInputRef = useRef(null);

  return (
    <div ref={searchRef} className={`w-50 ${composeStylePlus(true)} `}>
      <div className="flex flex-row items-center px-1 overflow-hidden">
        <svg
          className={`h-4 fill-gray-700 ${
            searchInput === ""
              ? "translate-x-0 pr-1"
              : "-translate-x-12 w-1 pl-0"
          } transform origin-left ease-out duration-150 transition`}
          fill="currentColour"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
        <input
          ref={searchInputRef}
          type="source"
          name="source"
          id="SOURCETEST"
          autoFocus={true}
          autoComplete="off"
          value={searchInput}
          placeholder="Search..."
          onChange={(event) => setSearchInput(event.target.value)}
          className={
            "outline-none border-none m-0 text-md w-full py-1 border-b border-gray-300 h-8 inline bg-gray-50"
          }
        />
      </div>
      <SearchResults
        isAdded={isElementPresent}
        searchResults={search(searchInput)}
        addElement={addElement}
        onCreateNew={(string) => dispatch(initiateNewService())}
        inputRef={searchInputRef}
      />
    </div>
  );
}

function If({
  children,
  condition,
}: {
  condition: boolean;
  children: ReactNode;
}) {
  if (condition) {
    return <>{children}</>;
  } else {
    return <></>;
  }
}

function IfElse() {}

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
  inputRef,
}: {
  searchResults: ServiceElement[];
  addElement: (name: string) => void;
  isAdded: (name: string) => boolean;
  onCreateNew: (name: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const [selected, setSelected] =
    useState<React.SetStateAction<ServiceElement | undefined>>(undefined);

  const handelChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setSelected(undefined);
  };

  const downPress = useKeyPress("ArrowDown", inputRef);
  const upPress = useKeyPress("ArrowUp", inputRef);
  const enterPress = useKeyPress("Enter", inputRef);
  const [cursor, setCursor] = useState<number>(-1);
  const [hovered, setHovered] = useState<ServiceElement | undefined>(undefined);

  useEffect(() => {
    if (searchResults.length && downPress) {
      if (cursor === searchResults.length - 1) {
        setCursor(0);
      } else {
        setCursor((prevState) =>
          prevState < searchResults.length - 1 ? prevState + 1 : prevState
        );
      }
    }
  }, [downPress]);
  useEffect(() => {
    if (searchResults.length && upPress) {
      if (cursor === 0) {
        setCursor(searchResults.length - 1);
      } else {
        setCursor((prevState) => (prevState > 0 ? prevState - 1 : prevState));
      }
    }
  }, [upPress]);
  useEffect(() => {
    if (
      (searchResults.length && enterPress) ||
      (searchResults.length && hovered)
    ) {
      setSelected(searchResults[cursor]);
    }
  }, [cursor]);
  useEffect(() => {
    if (searchResults.length && hovered) {
      setCursor(searchResults.indexOf(hovered));
    }
  }, [hovered]);

  useEffect(() => {
    if (searchResults[cursor]) {
      addElement(searchResults[cursor].name);
      setCursor(-1);
    }
  }, [enterPress]);

  return (
    <ul className="flex flex-col w-full flex-wrap border-t border-gray-200 space-y-1 ">
      {searchResults.map((element, i) => {
        return (
          <li
            key={element.id}
            onMouseEnter={() => setHovered(element)}
            onMouseLeave={() => setHovered(undefined)}
            onClick={() => {
              addElement(element.name);
            }}
            className={`${
              cursor === i ? "bg-blue-500 text-white" : ""
            } hover:bg-blue-500 group p-2 hover:text-white text-gray-700 w-full hover:cursor-pointer`}
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
          onMouseEnter={() => setHovered(undefined)}
          onMouseLeave={() => setHovered(undefined)}
          onClick={() => {
            addElement("new");
            onCreateNew("new");
          }}
          className={`${
            cursor === 0 ? "bg-blue-500 text-white" : ""
          } hover:bg-blue-500 group p-2 hover:text-white text-gray-700 w-full hover:cursor-pointer`}
        >
          <div className="flex flex-row font-light text-md items-center">
            <p>Create new</p>
            <div className="ml-auto">
              <PlusButtonSVG inverted={true} />
            </div>
          </div>
        </li>
      ) : (
        <></>
      )}
    </ul>
  );
}

const useKeyPress = function (
  targetKey: string,
  ref: RefObject<HTMLInputElement>
) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }: { key: string }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  React.useEffect(() => {
    ref.current?.addEventListener("keydown", downHandler);
    ref.current?.addEventListener("keyup", upHandler);

    return () => {
      ref.current?.removeEventListener("keydown", downHandler);
      ref.current?.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

export function ElementSearchInput({
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
