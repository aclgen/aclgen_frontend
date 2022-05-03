import { servicesVersion } from "typescript";
import { Repository } from "../../types/repository";
import {
  NetworkObjectElement,
  PortRange,
  PortService,
  ServiceElement,
  ServiceType,
} from "../../types/types";
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

export async function PushServices(
  commit: ServiceTransaction,
  repoId: string
): Promise<{
  data: ServiceElement[];
}> {
  const servies = commit.services.map((service) => translateService(service));

  const responseNew = await fetch(createAPIRoute(`repo/${repoId}/service/`), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(servies.filter((service) => service.status == "new")),
  })
    .then((response) => response.json())
    .catch((e) => []);

  const responseModified = await fetch(
    createAPIRoute(`repo/${repoId}/service/`),
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        servies.filter((service) => service.status == "modified")
      ),
    }
  )
    .then((response) => response.json())
    .catch((e) => []);

  //const result2 = await responseModeified.json();

  return { data: responseNew.concat(responseModified) };
}

export async function PushNetworkObjects(
  { objects }: { objects: NetworkObjectElement[] },
  repoId: string
): Promise<{
  data: ServiceElement[];
}> {
  const responseNew = await fetch(createAPIRoute(`repo/${repoId}/object/`), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      objects
        .filter((service) => service.status == "new")
        .map((element) => {
          return {
            ...element,
            range_start: 2,
            range_end: 2,
          };
        })
    ),
  })
    .then((response) => response.json())
    .catch((e) => []);

  const responseModified = await fetch(
    createAPIRoute(`repo/${repoId}/object/`),
    {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        objects
          .filter((service) => service.status == "modified")
          .map((element) => {
            return {
              ...element,
              range_start: 2,
              range_end: 2,
            };
          })
      ),
    }
  )
    .then((response) => response.json())
    .catch((e) => []);

  //const result2 = await responseModeified.json();

  return { data: responseNew.concat(responseModified) };
}

function translateService(service: ServiceElement): any {
  switch (service.type) {
    case ServiceType.PORT: {
      const portService = service as PortService;
      return {
        ...service,
        port_start: portService.port,
        port_end: portService.port,
      };
    }
    default: {
      const portService = service as PortRange;
      return {
        ...service,
        port_start: portService.portStart,
        port_end: portService.portEnd,
      };
    }
  }
}
