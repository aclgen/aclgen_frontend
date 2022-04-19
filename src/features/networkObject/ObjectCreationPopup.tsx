import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import NetworkObjectPopup, {
  NetworkObjectPopupProps,
} from "../../components/creationForm/NetworkObjectCreationForm";
import { IPV4 } from "../../types/types";
import {
  cancelCreationPopUp,
  initiatePopUp,
} from "../service/DraftServiceSlice";
import {
  selectNetworkObjects,
  modifyNetworkObject,
  createNewNetworkObject,
} from "./DraftNetworkObjectSlice";
import { v4 as uuidv4 } from "uuid";

function NetworkObjectPopupController() {
  const state = useAppSelector(selectNetworkObjects);

  switch (state.newObjectStatus) {
    case "creating":
      return <ObjectCreationPopup />;
    case "editing":
      //Need to add key property to this component to force it to rerender when changing service. Wierd Bug...
      return <ObjectEditPopup key={state.newObject.id} />;
    default:
      return <></>;
  }
}

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

  return (
    <NetworkObjectPopup key={newObject.id} object={newNetworkObjectProps} />
  );
}

export default NetworkObjectPopupController;
