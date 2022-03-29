import { rule } from "./ruleSlice";

export async function fetchRules(): Promise<{ data: rule[] }> {
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
