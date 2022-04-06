import { NetworkObjectElement } from "../../types/types";
import { createAPIRoute } from "../common/APIRoutes";

export async function fetchNetworkObjects(): Promise<{
  data: NetworkObjectElement[];
}> {
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

export async function fetchNetworkObjectsWithRepoId(
  repoId: string
): Promise<{ data: NetworkObjectElement[] }> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/object/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}
