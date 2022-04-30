import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ServicePopupForm from "../../components/creationForm/ServiceCreationForm";
import {
  PortRange,
  PortService,
  ServiceElement,
  ServiceType,
} from "../../types/types";
import {
  cancelCreationPopUp,
  createNewService,
  initiatePopUp,
  modifyService,
  selectService,
} from "./DraftServiceSlice";
import { v4 as uuidv4 } from "uuid";
import { PopUpFormProps } from "../../components/creationForm/PopUpForm";

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

  const service = state.newService;

  const baseFields = ServiceEditingBase(service);

  const serviceFields = ServiceEditingFields(service);

  const serviceProps: ServicePopUpProps = {
    isVisible: state.newServiceStatus === "editing",
    element: service,
    id: service.id,
    status: service.status == "new" ? "new" : "modified",
    type: service.type,
    ...baseFields,
    ...serviceFields,
    onSubmit: () => {
      dispatch(initiatePopUp());
      dispatch(
        modifyService(
          createNewServiceFromInputs(service, baseFields, serviceFields)
        )
      );
    },
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
    onDelete: () => {
      dispatch(initiatePopUp());
      dispatch(
        modifyService({
          ...createNewServiceFromInputs(service, baseFields, serviceFields),
          status: "deleted",
        })
      );
    },
  };
  return <ServicePopupForm service={serviceProps} />;
}

function ServiceCreationPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectService);

  console.log(state.newService);

  const newService: ServiceElement = createServiceFromState(state.newService);

  const baseFields = ServiceEditingBase(newService);

  const serviceFields = ServiceEditingFields(newService);

  console.log(newService);

  const serviceProps: ServicePopUpProps = {
    isVisible: state.newServiceStatus === "creating",
    element: newService,
    id: newService.id,
    status: newService.status,
    type: newService.type,
    ...baseFields,
    ...serviceFields,
    onSubmit: () => {
      dispatch(initiatePopUp());
      dispatch(
        createNewService(
          createNewServiceFromInputs(newService, baseFields, serviceFields)
        )
      );
    },
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
  };

  return <ServicePopupForm service={serviceProps} />;
}

function createNewServiceFromInputs(
  service: ServiceElement,
  baseElements: EditingBase,
  serviceElements: portEditingFields | PortRangeEditingFields
): PortService | PortRange {
  const newService: ServiceElement = {
    name: baseElements.name,
    type: service.type,
    id: service.id,
    comment: baseElements.comment,
    status: service.status === "new" ? "new" : "modified",
  };

  switch (service.type) {
    case ServiceType.PORT: {
      const elements = serviceElements as portEditingFields;
      return {
        ...newService,
        port: elements.port,
        protocol: elements.protocol,
      };
    }
    case ServiceType.PORT_RANGE: {
      const elements = serviceElements as PortRangeEditingFields;
      return {
        ...newService,
        portStart: elements.rangeStart,
        portEnd: elements.rangeEnd,
        protocol: elements.protocol,
      };
    }
  }
}

type EditingBase = {
  name: string;
  setName: (name: string) => void;
  comment: string;
  setComment: (comment: string) => void;
};

export function ServiceEditingBase(service: ServiceElement): EditingBase {
  const [name, setName] = useState(service.name);
  const [comment, setComment] = useState(service.comment);
  return { name, setName, comment, setComment };
}

export function ServiceEditingFields(service: ServiceElement) {
  if (service.type == ServiceType.PORT) {
    return createPortEditingFields(service as PortService);
  } else if (service.type == ServiceType.PORT_RANGE) {
    return createPortRangeEdititingFields(service as PortRange);
  }
}

type portEditingFields = {
  protocol: string;
  setProtocol: (protocol: string) => void;
  port: number;
  setPort: (protocol: number) => void;
};
function createPortEditingFields(service: PortService): portEditingFields {
  const [port, setPort] = useState(service.port);
  return { port, setPort, ...createProtocolEditingFields(service) };
}

function createProtocolEditingFields(service: PortService | PortRange) {
  const [protocol, setProtocol] = useState(service.protocol);
  return { protocol, setProtocol };
}

type PortRangeEditingFields = {
  protocol: string;
  setProtocol: (protocol: string) => void;
  rangeStart: number;
  setRangeStart: (protocol: number) => void;
  rangeEnd: number;
  setRangeEnd: (protocol: number) => void;
};
function createPortRangeEdititingFields(
  service: PortRange
): PortRangeEditingFields {
  const [rangeStart, setRangeStart] = useState(service.portStart);
  const [rangeEnd, setRangeEnd] = useState(service.portEnd);

  return {
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    ...createProtocolEditingFields(service),
  };
}

export function ServiceTypeToName(type: ServiceType): string {
  switch (type) {
    case ServiceType.PORT:
      return "Port";
    case ServiceType.PORT_RANGE:
      return "Port Range";
  }
}

export interface PortRangePopUpProps
  extends ServicePopupBaseProps,
    PortRangeEditingFields {}

export interface PortPopUpProps
  extends ServicePopupBaseProps,
    portEditingFields {}

export interface ServicePopupBaseProps
  extends PopUpFormProps,
    EditingBase,
    ServiceElement {}

export type ServicePopUpProps = PortPopUpProps | PortRangePopUpProps;

export default ServicePopup;

export function createServiceFromState(service: any): ServiceElement {
  if (service === undefined) {
    return createPortService({});
  } else if (service.type !== undefined) {
    createServiceFromType(service, service.type);
  }
}

function createServiceFromType(service: any, type: ServiceType) {
  switch (type) {
    case ServiceType.PORT_RANGE:
      return createPortRangeService(service);
    default:
      return createPortService(service);
  }
}

export function createPortRangeService(service: any) {
  const newService: PortService = {
    ...createServiceElement(service),
    port: service.port ? service.port : 0,
    protocol: service.protocol ? service.protocol : "TCP",
    type: ServiceType.PORT,
  };
  return newService;
}

export function createServiceElement(service: any) {
  const newService: ServiceElement = {
    name: service.name ? service.name : "",
    type: ServiceType.PORT,
    id: service.id ? service.id : uuidv4(),
    comment: service.comment ? service.comment : "",
    status: service.state ? service.status : "new",
  };
  return newService;
}

export function createPortService(service: any) {
  const newService: PortRange = {
    ...createServiceElement(service),
    protocol: service.protocol ? service.protocol : "TCP",
    type: ServiceType.PORT,
    portStart: service.portStart ? service.portStart : 0,
    portEnd: service.portEnd ? service.portEnd : 0,
  };
  return newService;

  return service;
}
