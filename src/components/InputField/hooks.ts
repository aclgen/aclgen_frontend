import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  removeDraggedItem,
  selectDraggable,
} from "../../features/draggable/draggableSlice";
import { EditableElement } from "../../types/types";

export function useSearchAble(searchAbleElements: EditableElement[]) {
  function searchName(input: string) {
    if (input === "" || input === undefined) {
      return [];
    } else {
      return searchAbleElements.filter((element) =>
        element.name.toLowerCase().includes(input.toLowerCase())
      );
    }
  }

  function searchId(id: string): EditableElement | undefined {
    if (id === "" || id === undefined) {
      return undefined;
    } else {
      return searchAbleElements.find((element) => element.id === id);
    }
  }

  return { searchName, searchId };
}

export function useHeightSensor() {
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

  return { inverted,height,  ref };
}

export function useDroppableStateChange(
  id: string,
  type: "service" | "object",
  addElement: (element: EditableElement) => void,
  availibleElements: EditableElement[]
) {
  const draggableState = useAppSelector(selectDraggable);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (
      draggableState.currentDroppedItem &&
      draggableState.currentDroppedItem.target === id &&
      draggableState.currentDroppedItem.dropped.type === type
    ) {
      addElement(
        availibleElements.find(
          (element) =>
            element.id === draggableState.currentDroppedItem.dropped.id
        )
      );
      dispatch(removeDraggedItem);
    }
  }, [draggableState.currentDroppedItem]);
}

export function useCloseOnLostFocus() {
  const searchMenu = useRef(null);

  const [isOpen, setOpen] = useState(false);

  const closeOpenMenus = (e: { target: any }) => {
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

export function useEditableElements(
  elements: EditableElement[],
  onChange: (elements: EditableElement[]) => void
) {
  function removeElement(removeElement: EditableElement) {
    if (elements.length > 1) {
      onChange(elements.filter((element) => element.id !== removeElement.id));
    }
  }

  function addElement(addElement: EditableElement, remove: boolean = false) {
    const element = elements.filter((element) => element.id === addElement.id);

    if (element.length === 0) {
      onChange([...elements, addElement]);
    } else if (remove) {
      removeElement(addElement);
    }
  }

  return { addElement, removeElement };
}