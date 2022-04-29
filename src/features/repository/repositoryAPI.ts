import { servicesVersion } from "typescript";
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

export async function commitServices(commit: ServiceTransaction, repoId: string): Promise<{
  data: ServiceElement[];
}> {
  const responseNew = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commit.services.filter(service => service.status == "new").map(element => {return {
      ...element,
      port_start: 2,
      port_end: 2 
    }})),
  }).then(response => response.json()).catch(e => []);

  const responseModified = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commit.services.filter(service => service.status == "modified").map(element => {return {
      ...element,
      port_start: 2,
      port_end: 2 
    }})),
  }).then(response => response.json()).catch(e => []);

  //const result2 = await responseModeified.json();

  return {data: responseNew.concat(responseModified)};
}
