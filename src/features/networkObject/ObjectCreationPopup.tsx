import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import NetworkObjectPopup from "../../components/creationForm/NetworkObjectCreationForm";
import {
  EditableElementStatus,
  IPV4,
  IPV4RANGE,
  NetworkObjectElement,
  NetworkObjectType,
} from "../../types/types";
import {
  cancelCreationPopUp,
  initiatePopUp,
} from "../service/DraftServiceSlice";
import {
  createNewNetworkObject,
  initiateModifyNetworkObject,
  initiateNewObject,
  modifyNetworkObject,
  selectNetworkObjects,
} from "./DraftNetworkObjectSlice";
import {
  createNewNetworkObjectFromInput,
  initiateNewNetworkObject,
} from "./NetworkObjectFactory";
import { PopUpFormProps } from "../../components/creationForm/PopUpForm";
import {
  IpRangeInputHandler,
  useIpRangeInputHandler,
  useObjectEditingBase,
  validateIp,
} from "./NetworkInputHandler";
import { StringInputHandler, useStringInputHandler } from "../input/baseInput";

function NetworkObjectPopupController() {
  const state = useAppSelector(selectNetworkObjects);

  switch (state.newObjectStatus) {
    case "idle":
      return <></>;
    default:
      return (
        <ObjectEditingPopup
          key={state.newObject.id}
          object={state.newObject}
          editingStatus={state.newObjectStatus}
        />
      );
  }
}

function ObjectEditingPopup({
  object,
  editingStatus,
}: {
  object: NetworkObjectElement;
  editingStatus: "idle" | "creating" | "editing";
}) {
  console.log(object);
  switch (object.type) {
    case "IPV4":
      return (
        <CreateIPV4Input
          object={object as IPV4}
          editingStatus={editingStatus}
        />
      );
    case "IPV4_RANGE":
      return (
        <CreateIPV4RangeInput
          object={object as IPV4RANGE}
          editingStatus={editingStatus}
        />
      );
  }
}

function CreateIPV4Input({
  object,
  editingStatus,
}: {
  object: IPV4;
  editingStatus: "idle" | "creating" | "editing";
}) {
  const dispatch = useAppDispatch();

  function updateNetworkObjectType(type: NetworkObjectType) {
    if (editingStatus === "editing") {
      dispatch(
        initiateModifyNetworkObject({
          ...object,
          ...baseFields,
          type: type,
        })
      );
    } else if (editingStatus === "creating") {
      dispatch(
        initiateNewObject({
          ...object,
          ...baseFields,
          type: type,
        })
      );
    }
  }

  const baseFields = useObjectEditingBase(object, updateNetworkObjectType);

  const ipInput = useStringInputHandler(object.ip, validateIp);

  const onSubmitAction = useObjectSubmitAction(
    () => createNewNetworkObjectFromInput(object, baseFields, ipInput),
    baseFields.status,
    editingStatus
  );

  const objectProps: IPV4PopUpProps = {
    ...object,
    ...baseFields,
    InputHandler: ipInput,
    isVisible: true,
    element: object,
    onSubmit: onSubmitAction,
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
  };
  return <NetworkObjectPopup key={object.id} object={objectProps} />;
}

function CreateIPV4RangeInput({
  object,
  editingStatus,
}: {
  object: IPV4RANGE;
  editingStatus: "idle" | "creating" | "editing";
}) {
  const dispatch = useAppDispatch();

  function updateNetworkObjectType(type: NetworkObjectType) {
    if (editingStatus === "editing") {
      dispatch(
        initiateModifyNetworkObject({
          ...object,
          ...baseFields,
          type: type,
        })
      );
    } else if (editingStatus === "creating") {
      dispatch(
        initiateNewNetworkObject({
          ...object,
          ...baseFields,
          type: type,
        })
      );
    }
  }

  const baseFields = useObjectEditingBase(object, updateNetworkObjectType);

  const ipInput = useIpRangeInputHandler(object.start, object.end, validateIp);

  const onSubmitAction = useObjectSubmitAction(
    () => createNewNetworkObjectFromInput(object, baseFields, ipInput),
    baseFields.status,
    editingStatus
  );

  const objectProps: IPV4RangePopUpProps = {
    ...object,
    ...baseFields,
    RangeInputHandler: ipInput,
    isVisible: true,
    element: object,
    onSubmit: onSubmitAction,
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
  };
  console.log(objectProps);
  return <NetworkObjectPopup key={object.id} object={objectProps} />;
}

export type ObjectEditingBase = {
  name: string;
  setName: (name: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  type: NetworkObjectType;
  setType: (type: NetworkObjectType) => void;
  status: EditableElementStatus;
};

function useObjectSubmitAction(
  createNewObjectFromInput: () => NetworkObjectElement,
  status: EditableElementStatus,
  editingStatus: "idle" | "creating" | "editing"
) {
  const dispatch = useAppDispatch();
  if (editingStatus === "editing") {
    return () => {
      dispatch(initiatePopUp());
      dispatch(modifyNetworkObject(createNewObjectFromInput()));
    };
  } else if (editingStatus === "creating") {
    return () => {
      dispatch(initiatePopUp());
      dispatch(createNewNetworkObject(createNewObjectFromInput()));
    };
  }
}

export type IPV4RangeEditingFields = {
  RangeInputHandler: IpRangeInputHandler;
};

export type IPV4EditingFields = {
  InputHandler: StringInputHandler;
};

export interface IPV4RangePopUpProps
  extends ObjectPopUpBaseProps,
    IPV4RangeEditingFields {}

export interface IPV4PopUpProps
  extends ObjectPopUpBaseProps,
    IPV4EditingFields {}

export interface ObjectPopUpBaseProps
  extends PopUpFormProps,
    ObjectEditingBase,
    NetworkObjectElement {}

export type NetworkObjectPopUpProps = IPV4RangePopUpProps | IPV4PopUpProps;

export default NetworkObjectPopupController;
