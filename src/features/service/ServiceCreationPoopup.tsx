import React, { useEffect, useState } from "react";
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
  initiateNewService,
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
      return <ServiceCreationPopup key={state.newServiceHash} />;
    case "editing":
      //Need to add key property to this component to force it to rerender when changing service. Wierd Bug...
      return <ServiceEditingPopup key={state.newServiceHash} />;
    default:
      return <></>;
  }
}

export function ServiceEditingPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectService);

  const service = state.newService;

  const baseFields = ServiceEditingBase(service, () => {});

  const serviceFields = ServiceEditingFields(service, baseFields.setType);

  const serviceProps: ServicePopUpProps = {
    isVisible: state.newServiceStatus === "editing",
    element: service,
    id: service.id,
    status: service.status == "new" ? "new" : "modified",
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

  const newService = state.newService;

  function updateServiceType(type: ServiceType) {
    dispatch(
      initiateNewService({
        ...state.newService,
        ...baseFields,
        ...serviceFields,
        type: type,
      })
    );
  }

  const baseFields = ServiceEditingBase(newService, updateServiceType);

  const serviceFields = ServiceEditingFields(newService, updateServiceType);

  const serviceProps: ServicePopUpProps = {
    ...baseFields,
    ...serviceFields,
    isVisible: state.newServiceStatus === "creating",
    element: newService,
    id: newService.id,
    status: "new",
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

  switch (baseElements.type) {
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
  type: ServiceType;
  setType: (type: ServiceType) => void;
};

export function ServiceEditingBase(
  service: ServiceElement,
  updateServiceType: (type: ServiceType) => void
): EditingBase {
  const [name, setName] = useState(service.name);
  const [comment, setComment] = useState(service.comment);
  const [type, setlocalType] = useState(service.type);

  function setType(type: ServiceType) {
    updateServiceType(type);
    setlocalType(type);
  }
  return { name, setName, comment, setComment, type, setType };
}

export function ServiceEditingFields(
  service: ServiceElement,
  updateServiceType: (type: ServiceType) => void
) {
  if (service.type == ServiceType.PORT) {
    return CreatePortEditingFields(service as PortService, updateServiceType);
  } else if (service.type == ServiceType.PORT_RANGE) {
    return CreatePortRangeEdititingFields(
      service as PortRange,
      updateServiceType
    );
  }
}

type portEditingFields = {
  protocol: string;
  setProtocol: (protocol: string) => void;
  port: number;
  setPort: (protocol: number) => void;
};
function CreatePortEditingFields(
  service: PortService,
  updateServiceType: (type: ServiceType) => void
): portEditingFields {
  const [port, setPortNumber] = useState(service.port);

  function setPort(input: any): void {
    console.log(input);
    if (String(input).includes("-")) {
      console.log(input);
      updateServiceType(ServiceType.PORT_RANGE);
    }

    setPortNumber(input);
  }

  return { port, setPort, ...CreateProtocolEditingFields(service) };
}

function CreateProtocolEditingFields(service: PortService | PortRange) {
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
function CreatePortRangeEdititingFields(
  service: PortRange,
  updateServiceType: (type: ServiceType) => void
): PortRangeEditingFields {
  const [rangeStart, setRangeStart] = useState(service.portStart);
  const [rangeEnd, setRangeEnd] = useState(service.portEnd);

  return {
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    ...CreateProtocolEditingFields(service),
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
    return createServiceFromType(service, service.type);
  } else {
    return createServiceFromType(service, ServiceType.PORT);
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
  const newService: PortRange = {
    ...createServiceElement(service, ServiceType.PORT_RANGE),
    portStart: service.portStart ? service.portStart : 0,
    portEnd: service.portEnd ? service.portEnd : 0,
    protocol: service.protocol ? service.protocol : "TCP",
    type: ServiceType.PORT_RANGE,
  };

  return newService;
}

export function createServiceElement(service: any, type: ServiceType) {
  const newService: ServiceElement = {
    name: service.name ? service.name : "",
    type: type,
    id: service.id ? service.id : uuidv4(),
    comment: service.comment ? service.comment : "",
    status: service.state ? service.status : "new",
  };
  return newService;
}

export function createPortService(service: any) {
  const newService: PortService = {
    ...createServiceElement(service, ServiceType.PORT),
    protocol: service.protocol ? service.protocol : "TCP",
    type: ServiceType.PORT,
    port: service.port ? service.port : 0,
  };
  return newService;
}
