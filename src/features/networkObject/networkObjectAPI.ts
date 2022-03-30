import { NetworkObjectElement } from "../../types/types";

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
