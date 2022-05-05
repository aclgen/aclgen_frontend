import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ServicePopupForm from "../../components/creationForm/ServiceCreationForm";
import {
  EditableElementStatus,
  PortRange,
  PortService,
  ServiceElement,
  ServiceType,
} from "../../types/types";
import {
  cancelCreationPopUp,
  createNewService,
  initiateModifyService,
  initiateNewService,
  initiatePopUp,
  modifyService,
  selectService,
} from "./DraftServiceSlice";
import { PopUpFormProps } from "../../components/creationForm/PopUpForm";
import {
  convertPortToPortRangeService,
  PortRangeInputHandler,
  usePortInputHandler,
  usePortRangeInputHandler,
  useProtocolInputHandler,
} from "./ServiceInputHandler";
import { createNewServiceFromInputs } from "./ServiceFactory";
import { StringInputHandler } from "../input/baseInput";

export function ServicePopup() {
  const state = useAppSelector(selectService);

  switch (state.newServiceStatus) {
    case "idle":
      return <></>;
    default:
      return (
        <ServiceCreationPopup
          key={state.newService.id}
          service={state.newService}
          editingStatus={state.newServiceStatus}
        />
      );
  }
}

function ServiceCreationPopup({
  service,
  editingStatus,
}: {
  service: ServiceElement;
  editingStatus: "idle" | "creating" | "editing";
}) {
  switch (service.type) {
    case ServiceType.PORT:
      return (
        <CreatePortServiceInput
          newService={service as PortService}
          editingStatus={editingStatus}
        />
      );
    case ServiceType.PORT_RANGE:
      return (
        <CreatePortRangeServiceInput
          newService={service as PortRange}
          editingStatus={editingStatus}
        />
      );
  }
}

function CreatePortServiceInput({
  newService,
  editingStatus,
}: {
  newService: PortService;
  editingStatus: "idle" | "creating" | "editing";
}) {
  const dispatch = useAppDispatch();

  function updateServiceType(type: ServiceType) {
    if (editingStatus === "editing") {
      dispatch(
        initiateModifyService({
          ...newService,
          ...baseFields,
          type: type,
        })
      );
    } else if (editingStatus === "creating") {
      dispatch(
        initiateNewService({
          ...newService,
          ...baseFields,
          type: type,
        })
      );
    }
  }

  const baseFields = ServiceEditingBase(newService, updateServiceType);

  const onSubmitSpecialCaseAction = useServiceModifyTypeAction(
    () => {
      return {
        ...createNewServiceFromInputs(newService, baseFields, {
          portInputHandler: portInput,
          protocolInputHandler: protocolInput,
        }),
        type: ServiceType.PORT_RANGE,
        portStart: portInput.inputValue,
        portEnd: portInput.inputValue,
        protocol: protocolInput.inputValue,
      };
    },
    baseFields.status,
    editingStatus
  );

  const specialInputHandler = convertPortToPortRangeService(
    onSubmitSpecialCaseAction
  );

  const portInput = usePortInputHandler(
    newService.port.toString(),
    specialInputHandler
  );

  const protocolInput = useProtocolInputHandler(newService.protocol);

  const onSubmitAction = useServiceSubmitAction(
    () =>
      createNewServiceFromInputs(newService, baseFields, {
        portInputHandler: portInput,
        protocolInputHandler: protocolInput,
      }),
    baseFields.status,
    editingStatus
  );

  const serviceProps: ServicePopUpProps = {
    ...newService,
    ...baseFields,
    protocolInputHandler: protocolInput,
    portInputHandler: portInput,
    ...portInput,
    isVisible: true,
    element: newService,
    onSubmit: onSubmitAction,
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
  };
  return <ServicePopupForm service={serviceProps} />;
}

function CreatePortRangeServiceInput({
  newService,
  editingStatus,
}: {
  newService: PortRange;
  editingStatus: "idle" | "creating" | "editing";
}) {
  const dispatch = useAppDispatch();

  function updateServiceType(type: ServiceType) {
    if (editingStatus === "editing") {
      dispatch(
        initiateModifyService({
          ...newService,
          ...baseFields,
          type: type,
        })
      );
    } else if (editingStatus === "creating") {
      dispatch(
        initiateNewService({
          ...newService,
          ...baseFields,
          type: type,
        })
      );
    }
  }

  const baseFields = ServiceEditingBase(newService, updateServiceType);

  const portInput = usePortRangeInputHandler(
    newService.portStart.toString(),
    newService.portEnd.toString()
  );

  const protocolInput = useProtocolInputHandler(newService.protocol);

  const onSubmitAction = useServiceSubmitAction(
    () =>
      createNewServiceFromInputs(newService, baseFields, {
        portRangeInputHandler: portInput,
        protocolInputHandler: protocolInput,
      }),
    baseFields.status,
    editingStatus
  );

  const serviceProps: PortRangePopUpProps = {
    ...newService,
    ...baseFields,
    protocolInputHandler: protocolInput,
    portRangeInputHandler: portInput,
    ...portInput,
    isVisible: true,
    element: newService,
    onSubmit: onSubmitAction,
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
  };
  return <ServicePopupForm service={serviceProps} />;
}

export function ServiceEditingBase(
  service: ServiceElement,
  updateServiceType: (type: ServiceType) => void
): EditingBase {
  const [name, setName] = useState(service.name);
  const [comment, setComment] = useState(service.comment);
  const [type, setlocalType] = useState(service.type);

  const status = service.status === "new" ? "new" : "modified";

  function setType(type: ServiceType) {
    updateServiceType(type);
    setlocalType(type);
  }
  return { name, setName, comment, setComment, type, setType, status };
}

export type EditingBase = {
  name: string;
  setName: (name: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  type: ServiceType;
  setType: (type: ServiceType) => void;
  status: EditableElementStatus;
};

export type PortRangeEditingFields = {
  protocolInputHandler: StringInputHandler;
  portRangeInputHandler: PortRangeInputHandler;
};

export type portEditingFields = {
  protocolInputHandler: StringInputHandler;
  portInputHandler: StringInputHandler;
};

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

function useServiceSubmitAction(
  createNewServiceFromInputs: () => ServiceElement,
  status: EditableElementStatus,
  editingStatus: "idle" | "creating" | "editing"
) {
  const dispatch = useAppDispatch();
  if (editingStatus === "editing") {
    return () => {
      dispatch(initiatePopUp());
      dispatch(modifyService(createNewServiceFromInputs()));
    };
  } else {
    return () => {
      dispatch(initiatePopUp());
      dispatch(createNewService(createNewServiceFromInputs()));
    };
  }
}

function useServiceModifyTypeAction(
  createNewServiceFromInputs: () => ServiceElement,
  status: EditableElementStatus,
  editingStatus: "idle" | "creating" | "editing"
) {
  const dispatch = useAppDispatch();
  if (editingStatus === "editing") {
    return () => {
      dispatch(initiateModifyService(createNewServiceFromInputs()));
    };
  } else {
    return () => {
      dispatch(initiateNewService(createNewServiceFromInputs()));
    };
  }
}

export default ServicePopup;
