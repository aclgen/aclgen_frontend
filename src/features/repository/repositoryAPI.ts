import { createAPIRoute } from "../common/APIRoutes";
import { RepositoryIdentifier } from "../common/APITypes";


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




