import RuleSet, { RuleElement } from "../../types/types";
import { createAPIRoute } from "../common/APIRoutes";

export async function fetchRules(): Promise<{ data: RuleElement[] }> {
  const response = await fetch("/api/rules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}

export async function fetchRulesWithDeviceId(
  repoId: string,
  deviceId: string
): Promise<{
  data: RuleSet;
}> {
  const response = await fetch(
    createAPIRoute(`repo/${repoId}/workspace/device/${deviceId}/rules`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
  const result = await response.json();
  return result;
}
