import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import NetworkObjectPopup, {
  NetworkObjectPopupProps,
} from "../../components/creationForm/NetworkObjectCreationForm";
import {
  EditableElementStatus,
  IPV4,
  NetworkObjectElement,
  NetworkObjectType,
  PortRange,
  PortService,
  ServiceElement,
  ServiceType,
} from "../../types/types";
import {
  cancelCreationPopUp,
  createNewService,
  initiateNewService,
  initiatePopUp,
  modifyService,
} from "../service/DraftServiceSlice";
import {
  selectNetworkObjects,
  modifyNetworkObject,
  createNewNetworkObject,
} from "./DraftNetworkObjectSlice";
import { v4 as uuidv4 } from "uuid";
import {
  convertPortToPortRangeService,
  PortRangeInputHandler,
  usePortInputHandler,
  useProtocolInputHandler,
} from "../service/ServiceInputHandler";
import { createNewServiceFromInputs } from "../service/ServiceFactory";
import ServicePopupForm from "../../components/creationForm/ServiceCreationForm";
import {
  EditingBase,
  portEditingFields,
  PortRangeEditingFields,
  ServiceEditingBase,
  ServicePopUpProps,
} from "../service/ServiceCreationPoopup";
import {
  createNewNetworkObjectFromInput,
  initiateNewNetworkObject,
} from "./NetworkObjectFactory";
import { PopUpFormProps } from "../../components/creationForm/PopUpForm";
import {
  IpRangeInputHandler,
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
        <ObjectEditingPopup key={state.newObject.id} object={state.newObject} />
      );
  }
}

function ObjectEditingPopup({ object }: { object: NetworkObjectElement }) {
  switch (object.type) {
    case "IPV4":
      return <CreateIPV4Input object={object as IPV4} />;
    case "IPV4_RANGE":
      return <CreateIPV4RangeInput newService={object as IPV4_Range} />;
  }
}

function CreateIPV4Input({ object }: { object: IPV4 }) {
  const dispatch = useAppDispatch();

  function updateNetworkObjectType(type: NetworkObjectType) {
    dispatch(
      initiateNewNetworkObject({
        ...object,
        ...baseFields,
        type: type,
      })
    );
  }

  const baseFields = useObjectEditingBase(object, updateNetworkObjectType);

  const specialInputHandler = convertPortToPortRangeService(() =>
    dispatch(
      initiateNewNetworkObject({
        ...createNewNetworkObjectFromInput(object, baseFields, ipInput),
      })
    )
  );

  const ipInput = useStringInputHandler(
    object.ip,
    validateIp,
    specialInputHandler
  );

  const onSubmitAction = useObjectSubmitAction(
    () => createNewNetworkObjectFromInput(object, baseFields, ipInput),
    baseFields.status
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

export type ObjectEditingBase = {
  name: string;
  setName: (name: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  type: NetworkObjectType;
  setType: (type: NetworkObjectType) => void;
  status: EditableElementStatus;
};

function ObjectEditPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectNetworkObjects);

  const editingObject: IPV4 = { ...(state.newObject as IPV4) };

  const [name, setName] = useState(editingObject.name);
  const [comment, setComment] = useState(editingObject.comment);
  const [ip, setIp] = useState(editingObject.ip);

  const newObject: IPV4 = {
    name: name,
    status: editingObject.status === "new" ? "new" : "modified",
    id: `${editingObject.id}`,
    comment: comment,
    ip: ip,
  };

  const editingObjectProps: NetworkObjectPopupProps = {
    isVisible: state.newObjectStatus === "editing",
    name: name,
    element: editingObject,
    setName: (name) => {
      setName(name);
    },
    comment: comment,
    setComment: (comment) => setComment(comment),
    ip: ip,
    setIp: setIp,
    onSubmit: () => {
      dispatch(initiatePopUp());
      dispatch(modifyNetworkObject(newObject));
    },
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
    onDelete: () => {
      dispatch(initiatePopUp());
      dispatch(modifyNetworkObject({ ...newObject, status: "deleted" }));
    },
  };

  return (
    <NetworkObjectPopup key={editingObject.id} object={editingObjectProps} />
  );
}

function ObjectCreationPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectNetworkObjects);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [ip, setIp] = useState("");

  const newObject: IPV4 = {
    name: name,
    status: "new",
    id: uuidv4(),
    comment: comment,
    ip: ip,
  };

  const newNetworkObjectProps: NetworkObjectPopupProps = {
    isVisible: state.newObjectStatus === "creating",
    name: name,
    element: newObject,
    setName: setName,
    comment: comment,
    setComment: setComment,
    ip: ip,
    setIp: setIp,
    onSubmit: () => {
      dispatch(initiatePopUp());
      dispatch(createNewNetworkObject(newObject));
    },
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
    onDelete: () => {
      dispatch(initiatePopUp());
      dispatch(modifyNetworkObject({ ...newObject, status: "deleted" }));
    },
  };

  return <NetworkObjectPopup object={newNetworkObjectProps} />;
}

function useObjectSubmitAction(
  createNewObjectFromInput: () => NetworkObjectElement,
  status: EditableElementStatus
) {
  const dispatch = useAppDispatch();
  if (status === "modified") {
    return () => {
      dispatch(initiatePopUp());
      dispatch(modifyNetworkObject(createNewObjectFromInput()));
    };
  } else {
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
