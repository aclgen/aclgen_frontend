import { ServiceElement } from "../../types/types";

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
