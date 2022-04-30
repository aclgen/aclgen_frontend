import {
  PortRange,
  PortService,
  ServiceElement,
  ServiceType,
} from "../../types/types";
import { createAPIRoute, host } from "../common/APIRoutes";

export async function fetchServices(): Promise<{ data: ServiceElement[] }> {
  const response = await fetch("/api/service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}

export async function fetchServicesWithRepoId(
  repoId: string
): Promise<ServiceElement[]> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  return result.map((element: any) => createServiceElement(element));
}
function createServiceElement(element: any): ServiceElement {
  if (element.range_start === element.range_end) {
    return { ...element, type: ServiceType.PORT } as PortService;
  } else {
    return {
      ...element,
      type: ServiceType.PORT_RANGE,
      portStart: element.range_start,
      portEnd: element.range_end,
    } as PortRange;
  }
}
