import { NetworkDevice } from "../../types/repository";
import { createAPIRoute } from "../common/APIRoutes";

export async function fetchWorkSpaceWithId(
  repoId: string
): Promise<{ data: NetworkDevice[] }> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/workspace/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result;
}

export async function fetchDevicesWithRepoId(
  repoId: string
): Promise<NetworkDevice[]> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/device`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result;
}
