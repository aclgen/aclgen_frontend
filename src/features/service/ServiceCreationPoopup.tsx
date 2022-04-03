import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ServicePopupForm, {
  ServicePopupProps,
} from "../../components/creationForm/ServiceCreationForm";
import { PortService, ServiceType } from "../../types/types";
import {
  cancelCreationPopUp,
  createNewService,
  modifyService,
  selectService,
} from "./DraftServiceSlice";

export function ServicePopup() {
  const state = useAppSelector(selectService);

  switch (state.newServiceStatus) {
    case "creating":
      return <ServiceCreationPopup />;
    case "editing":
      //Need to add key property to this component to force it to rerender when changing service. Wierd Bug...
      return <ServiceEditingPopup key={state.newService.id} />;
    default:
      return <></>;
  }
}

export function ServiceEditingPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectService);

  const service: PortService = state.newService as PortService;

  const [name, setName] = useState(service.name);
  const [comment, setComment] = useState(service.comment);
  const [sourcePort, setSourcePort] = useState(service.sourcePort);
  const [destinationPort, setDestinationPort] = useState(
    service.destinationPort
  );
  const [protocol, setProtocol] = useState(service.protocol);

  const newService: PortService = {
    name: name,
    type: service.type,
    status: service.status === "new" ? "new" : "modified",
    id: `${service.id}`,
    comment: comment,
    sourcePort: sourcePort,
    destinationPort: destinationPort,
    protocol: protocol,
  };

  const serviceProps: ServicePopupProps = {
    isVisible: state.newServiceStatus === "editing",
    name: name,
    setName: setName,
    comment: comment,
    setComment: setComment,
    sourcePort: sourcePort,
    setSourcePort: setSourcePort,
    destinationPort: destinationPort,
    setDestinationPort: setDestinationPort,
    protocol: protocol,
    setProtocol: setProtocol,
    onSubmit: () => dispatch(modifyService(newService)),
    onCancel: () => dispatch(cancelCreationPopUp()),
    onDelete: () =>
      dispatch(modifyService({ ...newService, status: "deleted" })),
  };
  return <ServicePopupForm service={serviceProps} />;
}

function ServiceCreationPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectService);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [sourcePort, setSourcePort] = useState(0);
  const [destinationPort, setDestinationPort] = useState(0);
  const [protocol, setProtocol] = useState("");

  const service: PortService = {
    name: name,
    type: ServiceType.PORT,
    status: "new",
    id: `${state.services.length}`,
    comment: comment,
    sourcePort: sourcePort,
    destinationPort: destinationPort,
    protocol: protocol,
  };

  const serviceProps: ServicePopupProps = {
    isVisible: state.newServiceStatus === "creating",
    name: name,
    setName: setName,
    comment: comment,
    setComment: setComment,
    sourcePort: sourcePort,
    setSourcePort: setSourcePort,
    destinationPort: destinationPort,
    setDestinationPort: setDestinationPort,
    protocol: protocol,
    setProtocol: setProtocol,
    onSubmit: () => dispatch(createNewService(service)),
    onCancel: () => dispatch(cancelCreationPopUp()),
  };

  return <ServicePopupForm service={serviceProps} />;
}

export default ServicePopup;
