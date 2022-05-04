import {PortRange, PortService, ServiceElement, ServiceType,} from "../../types/types";
import {createAPIRoute} from "../common/APIRoutes";
import {ServiceElementAPI} from "../../types/ApiTypes";

export async function fetchServicesWithRepoId(
  repoId: string
): Promise<{ data: ServiceElement[] }>{
  const response: Response = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result: ServiceElementAPI[] = await response.json();

  return {data: result.map(translateApiServiceElement)};
}

export async function saveServices(
    services: ServiceElement[],
    repoId: string
): Promise<{
  data: ServiceElement[];
}> {
  const newServices = services.filter((service) => service.status == "new").map(translateServiceElement)
  const modifiedServices = services.filter((service) => service.status == "modified").map(translateServiceElement)
  let newServiceResponse = [];
  let modifiedServicesResponse = [];

  if(newServices.length > 0){
    newServiceResponse = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newServices),
    })
        .then((response) => response.json())
        .catch((e) => []);
  }

  if(modifiedServices.length > 0){
    modifiedServicesResponse = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedServices),
    })
        .then((response) => response.json())
        .catch((e) => []);
  }

  return { data: newServiceResponse.concat(modifiedServicesResponse).map(translateApiServiceElement) };
}

function translateServiceElement(serviceElement: ServiceElement): ServiceElementAPI {
  switch (serviceElement.type) {
    case ServiceType.PORT: {
      const portService = serviceElement as PortService;
      return {
        ...serviceElement,
        protocol: portService.protocol,
        port_start: portService.port,
        port_end: portService.port
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
function translateApiServiceElement(serviceApiElement: ServiceElementAPI): ServiceElement {
  if(serviceApiElement.port_start == serviceApiElement.port_end){
    const service: PortService = {
      ...serviceApiElement,
      status: "source",
      type: ServiceType.PORT,
      protocol: serviceApiElement.protocol,
      port: serviceApiElement.port_start
    }

    return service;
  }
  if(serviceApiElement.protocol === "ICMP"){
    const service: PortRange = {
      ...serviceApiElement,
      status: "source",
      type: ServiceType.PORT_RANGE,
      protocol: serviceApiElement.protocol,
      portStart: serviceApiElement.port_start,
      portEnd: serviceApiElement.port_end,
    }
    return service;
  }

  const service: PortRange = {
    ...serviceApiElement,
    status: "source",
    type: ServiceType.PORT_RANGE,
    protocol: serviceApiElement.protocol,
    portStart: serviceApiElement.port_start,
    portEnd: serviceApiElement.port_end,
  }
  return service;
}



