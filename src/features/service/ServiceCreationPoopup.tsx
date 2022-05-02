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
import {
  PortRangeInputHandler,
  StringInputHandler,
  usePortInputHandler,
  usePortRangeInputHandler,
  useProtocolInputHandler,
} from "./ServiceInputHandler";

export function ServicePopup() {
  const state = useAppSelector(selectService);

  switch (state.newServiceStatus) {
    case "idle":
      return <></>;
    default:
      return <ServiceCreationPopup service={state.newService} />;
  }
}

function ServiceCreationPopup({ service }: { service: ServiceElement }) {
  switch (service.type) {
    case ServiceType.PORT:
      return <CreatePortServiceInput newService={service as PortService} />;
    case ServiceType.PORT_RANGE:
      return <CreatePortRangeServiceInput newService={service as PortRange} />;
  }
}

function CreatePortServiceInput({ newService }: { newService: PortService }) {
  const dispatch = useAppDispatch();

  function updateServiceType(type: ServiceType) {
    dispatch(
      initiateNewService({
        ...newService,
        ...baseFields,
        type: type,
      })
    );
  }

  const baseFields = ServiceEditingBase(newService, updateServiceType);

  const specialInputHandler = convertPortToPortRangeService(() =>
    dispatch(
      initiateNewService({
        ...createNewServiceFromInputs(newService, baseFields, {
          portInputHandler: portInput,
          protocolInputHandler: protocolInput,
        }),
        type: ServiceType.PORT_RANGE,
      })
    )
  );

  const portInput = usePortInputHandler(
    newService.port.toString(),
    specialInputHandler
  );

  const protocolInput = useProtocolInputHandler(newService.protocol);

  const serviceProps: ServicePopUpProps = {
    ...newService,
    ...baseFields,
    protocolInputHandler: protocolInput,
    portInputHandler: portInput,
    ...portInput,
    isVisible: true,
    element: newService,
    onSubmit: () => {
      dispatch(initiatePopUp());
      dispatch(
        createNewService(
          createNewServiceFromInputs(newService, baseFields, {
            portInputHandler: portInput,
            protocolInputHandler: protocolInput,
          })
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
function CreatePortRangeServiceInput({
  newService,
}: {
  newService: PortRange;
}) {
  const dispatch = useAppDispatch();

  function updateServiceType(type: ServiceType) {
    dispatch(
      initiateNewService({
        ...newService,
        ...baseFields,
        type: type,
      })
    );
  }

  const baseFields = ServiceEditingBase(newService, updateServiceType);

  const portInput = usePortRangeInputHandler(
    newService.portStart.toString(),
    newService.portEnd.toString()
  );

  const protocolInput = useProtocolInputHandler(newService.protocol);

  const serviceProps: PortRangePopUpProps = {
    ...newService,
    ...baseFields,
    protocolInputHandler: protocolInput,
    portRangeInputHandler: portInput,
    ...portInput,
    isVisible: true,
    element: newService,
    onSubmit: () => {
      dispatch(initiatePopUp());
      dispatch(
        createNewService(
          createNewServiceFromInputs(newService, baseFields, {
            portRangeInputHandler: portInput,
            protocolInputHandler: protocolInput,
          })
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

export const convertPortToPortRangeService = (execute: () => void) => {
  return {
    handleSingleInput: (input: string) => {
      if (String(input).includes("-")) {
        execute();
      }
    },
  };
};

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
        port: Number.parseInt(elements.portInputHandler.inputValue),
        protocol: elements.protocolInputHandler.inputValue,
      };
    }
    case ServiceType.PORT_RANGE: {
      const elements = serviceElements as PortRangeEditingFields;
      return {
        ...newService,
        portStart: Number.parseInt(
          elements.portRangeInputHandler.portFromHandler.inputValue
        ),
        portEnd: Number.parseInt(
          elements.portRangeInputHandler.portToHandler.inputValue
        ),
        protocol: elements.protocolInputHandler.inputValue,
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

type PortRangeEditingFields = {
  protocolInputHandler: StringInputHandler;
  portRangeInputHandler: PortRangeInputHandler;
};

type portEditingFields = {
  protocolInputHandler: StringInputHandler;
  portInputHandler: StringInputHandler;
};

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
