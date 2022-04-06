import { ServiceElement } from "../../types/types";
import { createAPIRoute } from "../common/APIRoutes";

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
): Promise<{ data: ServiceElement[] }> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}
