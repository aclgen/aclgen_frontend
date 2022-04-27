import { Rule, RuleElement } from "../../types/types";
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
): Promise<Rule[]> {
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
