import { useDroppable } from "@dnd-kit/core";
import React, {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditableElement, ServiceElement } from "../../types/types";
import { XIcon } from "../creationForm/PopUpForm";
import { PlusButtonSVG } from "../PLusButton";
import { Label } from "../rule/RuleCard";
import { CheckIconSVG, statusStyle } from "../SelectableElement/SideBarElement";
import {
  useCloseOnLostFocus,
  useDroppableStateChange,
  useEditableElements,
  useSearchAble,
} from "./hooks";

export const DroppableInputField = ({
  inputID,
  fieldType,
  elements,
  searchAbleElements,
  onCreateNewService: onCreateNewElement,
  onUpdateElements,
  droppableType,
  disabled = false,
}: {
  droppableType: "object" | "service";
  inputID: string;
  fieldType: string;
  elements: EditableElement[];
  searchAbleElements: EditableElement[];
  onCreateNewService: (name: string) => void;
  onUpdateElements: (elements: EditableElement[]) => void;
  disabled?: boolean;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: inputID,
    disabled: disabled,
    data: {
      type: droppableType,
    },
  });

  const { searchMenu, isOpen, setOpen } = useCloseOnLostFocus();

  const { searchName } = useSearchAble(searchAbleElements);

  const { addElement, removeElement } = useEditableElements(
    elements,
    onUpdateElements
  );

  useDroppableStateChange(
    inputID,
    droppableType,
    addElement,
    searchAbleElements
  );

  function isElementPresent(element: ServiceElement) {
    return elements.includes(element);
  }

  const [height, setHeight] = useState(0);
  const [inverted, setInverted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientHeight);
    const height = ref.current.getBoundingClientRect().top;
    const screenSize = document.body.getBoundingClientRect().height;
    if (height > screenSize / 2) {
      setInverted(true);
    } else {
      setInverted(false);
    }
  });

  return (
    <div ref={setNodeRef}>
      <div
        ref={ref}
        className="relative hover:cursor-text"
        onClick={() => {
          setOpen(true);
        }}
      >
        <If condition={isOpen && inverted}>
          <SearchInput
            searchRef={searchMenu}
            isElementPresent={isElementPresent}
            search={searchName}
            addElement={addElement}
            setOpen={() => setOpen(false)}
            createNew={onCreateNewElement}
            height={height}
            inverted={inverted}
          />
        </If>
        <Label value={fieldType} />
        <div>
          <FlexibleInputContainer
            isHovered={isOver}
            isCompatible={!disabled}
            inputElements={elements}
            removeElement={removeElement}
            onFocus={() => {
              setOpen(true);
            }}
          />
        </div>
        <If condition={isOpen && !inverted}>
          <SearchInput
            searchRef={searchMenu}
            isElementPresent={isElementPresent}
            search={searchName}
            addElement={addElement}
            setOpen={() => setOpen(false)}
            createNew={onCreateNewElement}
            inverted={inverted}
            height={height}
          />
        </If>
      </div>
    </div>
  );
};

function FlexibleInputContainer({
  isHovered,
  isCompatible,
  inputElements,
  removeElement,
  onFocus,
}: {
  isHovered: boolean;
  isCompatible: boolean;
  inputElements: EditableElement[];
  removeElement: (name: EditableElement) => void;
  onFocus: () => void;
}) {
  return (
    <div
      tabIndex={0}
      onFocus={onFocus}
      className={composeStyle(isHovered, isCompatible)}
    >
      <div className="text-md py-1 opacity-0 w-0">E</div>
      {inputElements.map((element) => (
        <InputElement
          key={element.id}
          element={element}
          onRemove={removeElement}
          disableRemove={inputElements.length > 1}
        />
      ))}
    </div>
  );
}
interface SearchInputProps {
  searchRef: React.MutableRefObject<any>;
  isElementPresent: (element: EditableElement) => boolean;
  search: (input: string) => EditableElement[];
  addElement: (name: EditableElement, remove?: boolean) => void;
  setOpen: () => void;
  createNew: (input: string) => void;
  inverted: boolean;
  height: number;
}

function SearchInput({
  searchRef,
  isElementPresent,
  search,
  addElement,
  setOpen,
  createNew,
  inverted,
  height,
}: SearchInputProps) {
  const [searchInput, setSearchInput] = useState("");

  const searchInputRef = useRef(null);

  const tabPress = useKeyPress("Tab", searchInputRef);

  useEffect(() => {
    if (tabPress) {
      setOpen();
    }
  });
  return (
    <div
      style={{ bottom: `${inverted ? `${height - 20}px` : ""}` }}
      ref={searchRef}
      className={`w-50 ${composeStylePlus(true)} ${
        true ? "scale-100" : "scale-0"
      } transform origin-top ease-in-out duration-150 transition`}
    >
      <If condition={inverted}>
        <SearchResults
          isAdded={isElementPresent}
          searchResults={search(searchInput)}
          addElement={addElement}
          onCreateNew={() => {
            setOpen();
            createNew(searchInput);
          }}
          inputRef={searchInputRef}
          setOpen={setOpen}
        />
      </If>
      <div
        className={`flex flex-row items-center px-1 ${
          inverted ? "border-t" : "border-b"
        } overflow-hidden`}
      >
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
            "outline-none  m-0 text-md w-full py-2  h-8 inline bg-gray-50"
          }
        />
      </div>
      <If condition={!inverted}>
        <SearchResults
          isAdded={isElementPresent}
          searchResults={search(searchInput)}
          addElement={addElement}
          onCreateNew={() => {
            setOpen();
            createNew(searchInput);
          }}
          inputRef={searchInputRef}
          setOpen={setOpen}
        />
      </If>
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

const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

export function SearchResults({
  searchResults,
  addElement,
  isAdded,
  onCreateNew,
  inputRef,
  setOpen,
}: {
  searchResults: EditableElement[];
  addElement: (name: EditableElement, remove?: boolean) => void;
  isAdded: (name: EditableElement) => boolean;
  onCreateNew: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setOpen: () => void;
}) {
  const [selected, setSelected] =
    useState<React.SetStateAction<EditableElement | undefined>>(undefined);

  const downPress = useKeyPress("ArrowDown", inputRef);
  const upPress = useKeyPress("ArrowUp", inputRef);
  const enterPress = useKeyPress("Enter", inputRef);
  const escapePress = useKeyPress("Escape", inputRef);
  const [cursor, setCursor] = useState<number>(0);
  const [hovered, setHovered] = useState<EditableElement | undefined>(
    undefined
  );

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

  useDidMountEffect(() => {
    if (searchResults[cursor] && enterPress) {
      addElement(searchResults[cursor], true);
    }
    if (searchResults.length === 0) {
      onCreateNew();
    }
  }, [enterPress]);

  useDidMountEffect(() => {
    if (escapePress) {
      setOpen();
    }
  }, [escapePress]);

  return (
    <ul className="flex flex-col w-fullspace-y-1 ">
      {searchResults.map((element, i) => {
        return (
          <li
            key={element.id}
            onMouseEnter={() => setHovered(element)}
            onMouseLeave={() => setHovered(undefined)}
            onClick={() => {
              addElement(element, true);
            }}
            className={`${
              cursor === i ? "bg-blue-500 text-white" : ""
            } hover:bg-blue-500 group p-2 hover:text-white text-gray-700 w-full hover:cursor-pointer`}
          >
            <div className="flex flex-row">
              <p>{element.name}</p>
              {isAdded(element) ? (
                <div className="ml-auto pr-1">
                  <CheckIconSVG size="sm" isHovering={cursor === i} />
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
            onCreateNew();
          }}
          className={`${
            cursor === 0 ? "bg-blue-500 text-white" : ""
          } hover:bg-blue-500 group p-2 hover:text-white text-gray-700 w-full hover:cursor-pointer`}
        >
          <div className="flex flex-row font-light text-md items-center">
            <p>Create new</p>
            <div className="ml-auto">
              <PlusButtonSVG inverted={true} isHovering={cursor === 0} />
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

  function downHandler(event: KeyboardEvent) {
    if (event.key === targetKey) {
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

export function InputElement({
  element,
  onRemove,
  disableRemove,
}: {
  element: EditableElement;
  onRemove: (element: EditableElement) => void;
  disableRemove: boolean;
}) {
  return (
    <div
      key={element.id}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`flex flex-row bg-white space-x-2 hover:cursor-pointer hover:shadow-lg transition-shadow  ${statusStyle(
        "source"
      )} outline-none shadow-md items-center px-2 py-1 rounded-md`}
    >
      <p className="text-md select-none text-gray-700 ">{element.name}</p>
      <div className="ml-auto">
        {disableRemove ? (
          <XIcon
            onClick={(e) => {
              e.stopPropagation();

              onRemove(element);
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

function composeStyle(isHovering: boolean, isComatible = true): string {
  const baseStyle =
    "bg-gray-50 flex flex-row flex-wrap outline-none hover:cursor-text h-auto block p-1 w-32 rounded-lg overflow-wrap";

  const text = "text-gray-900 text-sm";

  let border = `border-2 ${
    isHovering ? "border-blue-500" : "border-gray-300"
  } hover:border-blue-500 active:border-blue-500 focus:border-blue-500`;

  if (!isComatible) {
    border = `opacity-50 border-2 ease-in-out transition duration-150`;
  }

  return `${baseStyle} ${text} ${border} `;
}

function composeStylePlus(isHovering: boolean): string {
  const baseStyle =
    "bg-gray-50 absolute flex flex-col flew-wrap mt-1 min-h-20 w-56 h-fit z-50 flex flex-row outline-none rounded-lg";

  const text = "text-gray-900 text-sm";

  const border = `border-2 ${
    isHovering ? "border-blue-500" : "border-gray-300"
  } hover:border-blue-500 active:border-blue-500`;

  return `${baseStyle} ${text} ${border} `;
}
