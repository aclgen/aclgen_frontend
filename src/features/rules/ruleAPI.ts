import { RuleElement } from "../../types/types";

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
