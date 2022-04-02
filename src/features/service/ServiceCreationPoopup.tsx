import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ServicePopupForm, {
  ServicePopupProps,
} from "../../components/creationForm/ServiceCreationForm";
import { ServiceType } from "../../types/types";

import { createNewService, selectService } from "./DraftServiceSlice";

export function ServicePopup() {
  const state = useAppSelector(selectService);

  if (state.newServiceStatus == "creating") {
    return <ServiceCreationPopup />;
  } else {
    return <ServiceEditingPopup />;
  }
}

export function ServiceEditingPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectService);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [sourcePort, setSourcePort] = useState(0);
  const [destinationPort, setDestinationPort] = useState(0);
  const [protocol, setProtocol] = useState("");

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
    onSubmit: () =>
      dispatch(
        createNewService({
          name: name,
          type: ServiceType.PORT,
          status: "modified",
          id: "1",
          comment: comment,
        })
      ),
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
    onSubmit: () =>
      dispatch(
        createNewService({
          name: name,
          type: ServiceType.PORT,
          status: "new",
          id: "1",
          comment: comment,
        })
      ),
  };

  return <ServicePopupForm service={serviceProps} />;
}

export default ServicePopup;
