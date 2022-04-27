import { Repository } from "../../types/repository";
import { ServiceElement } from "../../types/types";
import { createAPIRoute, host } from "../common/APIRoutes";
import { RepositoryIdentifier } from "../common/APITypes";
import { ServiceTransaction } from "../PushActions/types";

export async function fetchRepositories(): Promise<{
  data: RepositoryIdentifier[];
}> {

  const response = await fetch(createAPIRoute("repo/"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return { data: result };
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
