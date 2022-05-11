import React, {
  ReactChildren,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { If } from "../../components/If";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeMenu, openMenu, selectRightClick } from "./RightClickSlice";
import {
  initiateNewService,
  initiatePopUp,
  modifyService,
  selectService,
} from "../service/DraftServiceSlice";
import { initiateNewRule, modifyRule, selectRule } from "../rules/ruleSlice";
import {
  initiateNewObject,
  modifyNetworkObject,
  selectNetworkObjects,
} from "../networkObject/DraftNetworkObjectSlice";
import { selectWorkspaceDraft } from "../workSpaceDraft/DraftWorkSpaceSlice";
import {
  EditableElement,
  NetworkObjectElement,
  RuleElement,
  ServiceElement,
} from "../../types/types";
import { v4 as uuidv4 } from "uuid";

export default function RightClickHandler() {
  const ref = useRef();
  const { xPos, yPos, showMenu, setShowMenu } = useContextMenu(ref);

  function onClick(callback: () => void) {
    dispatch(initiatePopUp());
    setShowMenu(false);
    callback();
  }
  const rightClickState = useAppSelector(selectRightClick);
  const serviceState = useAppSelector(selectService);
  const ruleState = useAppSelector(selectRule);
  const objectState = useAppSelector(selectNetworkObjects);
  const workSpaceState = useAppSelector(selectWorkspaceDraft);

  useEffect(() => {
    if (showMenu) {
      dispatch(openMenu());
    } else {
      dispatch(closeMenu());
    }
  }, [showMenu]);

  const dispatch = useAppDispatch();

  function handleElement(element: EditableElement, action: ActionType) {
    if (
      serviceState.services.filter((service) => service.id === element.id)
        .length > 0
    ) {
      if (action == ActionType.COPY) {
        dispatch(
          initiateNewService({ ...(element as ServiceElement), id: uuidv4() })
        );
      } else if (action == ActionType.DELETE) {
        dispatch(
          modifyService({ ...(element as ServiceElement), status: "deleted" })
        );
      }
    } else if (
      objectState.networkObjects.filter((object) => object.id === element.id)
        .length > 0
    ) {
      if (action == ActionType.COPY) {
        dispatch(
          initiateNewObject({
            ...(element as NetworkObjectElement),
            id: uuidv4(),
          })
        );
      } else if (action == ActionType.DELETE) {
        dispatch(
          modifyNetworkObject({
            ...(element as NetworkObjectElement),
            status: "deleted",
          })
        );
      }
    } else if (
      ruleState.rules.filter((rule) => rule.id === element.id).length > 0
    ) {
      console.log("rule");
      if (action == ActionType.COPY) {
        dispatch(
          initiateNewRule({ ...(element as RuleElement), id: uuidv4() })
        );
      } else if (action == ActionType.DELETE) {
        dispatch(
          modifyRule({ ...(element as RuleElement), status: "deleted" })
        );
      }
    }
  }

  return (
    <div className={"relative"}>
      <If condition={showMenu}>
        <div
          ref={ref}
          className={`absolute z-20 transition-opacity ${
            showMenu ? "opacity-100" : "opacity-0"
          }`}
          style={{
            top: yPos,
            left: xPos,
          }}
        >
          <ul
            className={
              "flex flex-col flex-nowrap bg-white border-2 rounded-md hover:border-blue-600 border-gray-300 overflow-hidden shadow-lg "
            }
          >
            {rightClickState.rightClickedElement ? (
              <>
                <DropDownElement
                  onClick={() =>
                    onClick(() =>
                      handleElement(
                        rightClickState.rightClickedElement,
                        ActionType.COPY
                      )
                    )
                  }
                >
                  <p
                    className={"text-gray-700 font-light hover:text-white p-2"}
                  >
                    Copy {rightClickState.rightClickedElement.name}
                  </p>
                </DropDownElement>
                <div className={"border-gray-300 border-t"} />
              </>
            ) : null}
            <DropDownElement
              onClick={() => onClick(() => dispatch(initiateNewService({})))}
            >
              <p className={"text-gray-700 font-light hover:text-white p-2"}>
                New Service
              </p>
            </DropDownElement>
            <DropDownElement
              onClick={() => onClick(() => dispatch(initiateNewObject({})))}
            >
              <p className={"text-gray-700 font-light hover:text-white p-2"}>
                New Network Object
              </p>
            </DropDownElement>
            <DropDownElement
              onClick={() => onClick(() => dispatch(initiateNewRule()))}
            >
              <p className={"text-gray-700 font-light hover:text-white p-2"}>
                New Rule
              </p>
            </DropDownElement>
            {rightClickState.rightClickedElement ? (
              <>
                <div className={"border-gray-300 border-t"} />
                <DropDownElement
                  onClick={() =>
                    onClick(() =>
                      handleElement(
                        rightClickState.rightClickedElement,
                        ActionType.DELETE
                      )
                    )
                  }
                >
                  <p
                    className={"text-gray-700 font-light hover:text-white p-2"}
                  >
                    Delete {rightClickState.rightClickedElement.name}
                  </p>
                </DropDownElement>
                <div className={"border-gray-300 border-t"} />
              </>
            ) : null}
          </ul>
        </div>
      </If>
    </div>
  );
}

enum ActionType {
  COPY = "COPY",
  DELETE = "DELETE",
}

function DropDownElement({
  children,
  onClick,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <li
      className={"hover:cursor-pointer hover:bg-blue-600"}
      onClick={(event) => {
        event.stopPropagation();
        event.stopPropagation();
        onClick();
      }}
    >
      {children}
    </li>
  );
}

const useContextMenu = (ref: React.MutableRefObject<undefined>) => {
  const [xPos, setXPos] = useState(0);

  const [yPos, setYPos] = useState(0);

  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();

      setXPos(e.pageX);

      setYPos(e.pageY);

      setShowMenu(true);
    },

    [setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.addEventListener("click", handleClick);

      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  useLayoutEffect(() => {
    if (ref !== undefined) {
      if (xPos + ref.current?.offsetWidth > window.innerWidth) {
        setXPos(xPos - ref.current?.offsetWidth);
      }
      if (yPos + ref.current?.offsetWidth > window.innerHeight) {
        setYPos(yPos - ref.current?.offsetHeight);
      }
    }
  }, [xPos, yPos]);

  return { xPos, yPos, showMenu, setShowMenu };
};
