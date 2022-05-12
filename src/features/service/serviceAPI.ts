import {
  PortRange,
  PortService,
  ServiceElement,
  ServiceType,
} from "../../types/types";
import { createAPIRoute } from "../common/APIRoutes";
import { ServiceElementAPI } from "../../types/ApiTypes";

export async function fetchServicesWithRepoId(
  repoId: string
): Promise<{ data: ServiceElement[] }> {
  const response: Response = await fetch(
    createAPIRoute(`repo/${repoId}/service/`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result: ServiceElementAPI[] = await response.json();

  return { data: result.map(translateApiServiceElement) };
}

export async function saveServices(
  services: ServiceElement[],
  repoId: string
): Promise<{
  data: ServiceElement[];
}> {
  const newServices = services
    .filter((service) => service.status == "new")
    .map(translateServiceElement);
  const modifiedServices = services
    .filter((service) => service.status == "modified")
    .map(translateServiceElement);
  let newServiceResponse = [];
  let modifiedServicesResponse = [];
  const deletedServices = services
    .filter((service) => service.status == "deleted")
    .map(translateServiceElement);
  let deletedServicesResponse = [];

  if (newServices.length > 0) {
    newServiceResponse = await fetch(
      createAPIRoute(`repo/${repoId}/service/`),
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newServices),
      }
    )
      .then((response) => response.json())
      .catch((e) => []);
  }

  if (deletedServices.length > 0) {
    const pendingDeletes = deletedServices.map((service) =>
      fetch(createAPIRoute(`repo/${repoId}/service/${service.id}/`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      })
        .then((response) => service)
        .catch((e) => {})
    );
    deletedServicesResponse = await Promise.all(pendingDeletes);
  }

  if (modifiedServices.length > 0) {
    const modifiedServicesResponsePending = modifiedServices.map((service) =>
      fetch(createAPIRoute(`repo/${repoId}/service/${service.id}/`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(service),
      })
        .then((response) => response.json())
        .catch((e) => {})
    );
    modifiedServicesResponse = await Promise.all(
      modifiedServicesResponsePending
    );
  }

  return {
    data: newServiceResponse
      .concat(modifiedServicesResponse)
      .concat(deletedServicesResponse)
      .map(translateApiServiceElement),
  };
}

function translateServiceElement(
  serviceElement: ServiceElement
): ServiceElementAPI {
  switch (serviceElement.type) {
    case ServiceType.PORT: {
      const portService = serviceElement as PortService;
      return {
        ...serviceElement,
        protocol: portService.protocol,
        port_start: portService.port,
        port_end: portService.port,
      };
    }
    default: {
      const portService = serviceElement as PortRange;
      return {
        ...serviceElement,
        protocol: portService.protocol,
        port_start: portService.portStart,
        port_end: portService.portEnd,
      };
    }
  }
}

// noinspection UnnecessaryLocalVariableJS
function translateApiServiceElement(
  serviceApiElement: ServiceElementAPI
): ServiceElement {
  if (serviceApiElement.port_start == serviceApiElement.port_end) {
    const service: PortService = {
      ...serviceApiElement,
      status: "source",
      type: ServiceType.PORT,
      protocol: serviceApiElement.protocol,
      port: serviceApiElement.port_start,
    };

    return service;
  }
  if (serviceApiElement.protocol === "ICMP") {
    const service: PortRange = {
      ...serviceApiElement,
      status: "source",
      type: ServiceType.PORT_RANGE,
      protocol: serviceApiElement.protocol,
      portStart: serviceApiElement.port_start,
      portEnd: serviceApiElement.port_end,
    };
    return service;
  }

  const service: PortRange = {
    ...serviceApiElement,
    status: "source",
    type: ServiceType.PORT_RANGE,
    protocol: serviceApiElement.protocol,
    portStart: serviceApiElement.port_start,
    portEnd: serviceApiElement.port_end,
  };
  return service;
}
