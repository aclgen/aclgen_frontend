import { Repository } from "../../types/repository";
import { ServiceElement } from "../../types/types";
import { createAPIRoute } from "../common/APIRoutes";
import { ServiceTransaction } from "../PushActions/types";

export async function fetchRepositories(): Promise<{
  data: Repository[];
}> {
  const response = await fetch(createAPIRoute("repo/"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}

export async function commitServices(commit: ServiceTransaction): Promise<{
  data: ServiceElement[];
}> {
  const response = await fetch("/api/repository/commitServices", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commit),
  });
  const result = await response.json();

  return result;
}
