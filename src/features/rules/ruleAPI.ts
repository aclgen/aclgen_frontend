import { Rule, RuleAPIResponse, RuleElement } from "../../types/types";
import { createAPIRoute, host } from "../common/APIRoutes";

export async function fetchRules(): Promise<{ data: RuleElement[] }> {
  const response = await fetch("/api/rules", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": host(),
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}

export async function fetchRulesWithDeviceId(
  repoId: string,
  deviceId: string
): Promise<RuleAPIResponse[]> {
  const response = await fetch(
    createAPIRoute(`repo/${repoId}/device/${deviceId}/rule`),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();
  return result;
}
