import { Rule, RuleElement } from "../../types/types";
import { createAPIRoute, host } from "../common/APIRoutes";
import { RuleElementAPI } from "../../types/ApiTypes";

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
): Promise<RuleElementAPI[]> {
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

export async function saveRules(
  rules: RuleElement[],
  repoId: string,
  deviceId: string
): Promise<{
  data: RuleElementAPI[];
}> {
  const newRules = rules
    .filter((rule) => rule.status == "new")
    .map(translateRuleElement);
  const modifiedRules = rules
    .filter((rule) => rule.status == "modified")
    .map(translateRuleElement);
  let newRuleRsponse = [];
  let modifiedRuleResponse = [];

  if (newRules.length > 0) {
    const pendingRules = newRules.map((rule) =>
      fetch(createAPIRoute(`repo/${repoId}/device/${deviceId}/rule/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rule),
      })
        .then((response) => response.json())
        .catch((e) => {})
    );
    newRuleRsponse = await Promise.all(pendingRules);
  }
  if (modifiedRules.length > 0) {
    const pendingRules = modifiedRules.map((rule) =>
      fetch(
        createAPIRoute(`repo/${repoId}/device/${deviceId}/rule/${rule.id}/`),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rule),
        }
      )
        .then((response) => response.json())
        .catch((e) => console.log(e))
    );
    modifiedRuleResponse = await Promise.all(pendingRules);
  }
  return {
    data: newRuleRsponse.concat(modifiedRuleResponse),
  };
}

function translateRuleElement(translateRuleElement: Rule): RuleElementAPI {
  const newRule: RuleElementAPI = {
    ...translateRuleElement,
    services_sources: translateRuleElement.sourceServices.map(
      (element) => element.id
    ),
    services_destinations: translateRuleElement.destinationServices.map(
      (element) => element.id
    ),
    sources: translateRuleElement.sources.map((element) => element.id),
    destinations: translateRuleElement.sources.map((element) => element.id),
    folder: translateRuleElement.folder,
    direction: translateRuleElement.direction,
    action: translateRuleElement.policy,
  };
  return newRule;
}
