import {
  ServiceElement,
  ServiceType,
  PortRange,
  PortService,
} from "../../types/types";
import {
  EditingBase,
  portEditingFields,
  PortRangeEditingFields,
} from "./ServiceCreationPoopup";

import { v4 as uuidv4 } from "uuid";

export function createServiceFromState(service: any): ServiceElement {
  if (service === undefined) {
    return createPortService({});
  } else if (
    service.port_start &&
    service.port_end &&
    service.port_start === service.port_end
  ) {
    return createServiceFromType(service, ServiceType.PORT);
  } else if (
    service.port_start &&
    service.port_end &&
    service.port_start !== service.port_end
  ) {
    return createServiceFromType(service, ServiceType.PORT_RANGE);
  } else if (service.type !== undefined) {
    return createServiceFromType(service, service.type);
  } else {
    return createServiceFromType(service, ServiceType.PORT);
  }
}

export function createServiceFromType(service: any, type: ServiceType) {
  switch (type) {
    case ServiceType.PORT_RANGE:
      return createPortRangeService(service);
    default:
      return createPortService(service);
  }
}

export function createPortRangeService(service: any) {
  let portEnd;
  let portStart;

  if (service.portStart) {
    portStart = service.portStart;
  } else if (service.port_start) {
    portStart = service.port_start;
  } else {
    portStart = 0;
  }

  if (service.portEnd) {
    portEnd = service.portEnd;
  } else if (service.port_end) {
    portEnd = service.port_end;
  } else {
    portEnd = 0;
  }

  const newService: PortRange = {
    ...createServiceElement(service, ServiceType.PORT_RANGE),
    portStart,
    portEnd,
    protocol: service.protocol ? service.protocol : "TCP",
    type: ServiceType.PORT_RANGE,
  };

  return newService;
}

export function createServiceElement(service: any, type: ServiceType) {
  const newService: ServiceElement = {
    ...service,
    name: service.name ? service.name : "",
    type: type,
    id: service.id ? service.id : uuidv4(),
    comment: service.comment ? service.comment : "",
    status: service.status ? service.status : "new",
    port_start: undefined,
    port_end: undefined,
  };
  return newService;
}

export function createPortService(service: any) {
  let port;

  if (service.port && service.port !== 0 && service.port !== "0") {
    port = service.port;
  } else if (service.portFrom) {
    port = service.portFrom;
  } else if (service.port_start) {
    port = service.port_start;
  } else {
    port = 0;
  }
  const newService: PortService = {
    ...createServiceElement(service, ServiceType.PORT),
    protocol: service.protocol ? service.protocol : "TCP",
    type: ServiceType.PORT,
    port: port,
  };
  return newService;
}

export function ServiceTypeToName(type: ServiceType): string {
  switch (type) {
    case ServiceType.PORT:
      return "Port";
    case ServiceType.PORT_RANGE:
      return "Port Range";
  }
}

export function createNewServiceFromInputs(
  service: ServiceElement,
  baseElements: EditingBase,
  serviceElements: portEditingFields | PortRangeEditingFields
): PortService | PortRange {
  const newService: ServiceElement = {
    ...service,
    name: baseElements.name,
    type: service.type,
    id: service.id,
    comment: baseElements.comment,
    status: baseElements.status,
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
