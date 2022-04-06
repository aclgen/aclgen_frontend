import { NetworkDevice, WorkSpace } from "../../types/repository";
import { createAPIRoute } from "../common/APIRoutes";

export async function fetchWorkSpaceWithId(
  repoId: string
): Promise<{ data: WorkSpace }> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/workspace/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}

export async function fetchDevicesWithWorkSpaceId(
  repoId: string
): Promise<{ data: NetworkDevice[] }> {
  const response = await fetch(
    createAPIRoute(`repo/${repoId}/workspace/device`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
  const result = await response.json();
  return result;
}
