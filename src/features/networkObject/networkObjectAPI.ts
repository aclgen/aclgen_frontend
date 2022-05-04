import {
  IPV4,
  IPV4RANGE,
  NetworkObjectElement,
  NetworkObjectType,
} from "../../types/types";
import { createAPIRoute } from "../common/APIRoutes";
import { ObjectElementAPI } from "../../types/ApiTypes";

export async function fetchNetworkObjectsWithRepoId(repoId: string): Promise<{
  data: NetworkObjectElement[];
}> {
  const response = await fetch(createAPIRoute(`repo/${repoId}/object/`), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return { data: result.map(translateApiNetworkObject) };
}

export async function SaveNetworkObjects(
  { objects }: { objects: NetworkObjectElement[] },
  repoId: string
): Promise<{
  data: NetworkObjectElement[];
}> {
  const newObjects = objects
    .filter((service) => service.status == "new")
    .map(translateNetworkObjectElement);
  const modifiedObjects = objects
    .filter((service) => service.status == "modified")
    .map(translateNetworkObjectElement);
  let newObjectsResponse = [];
  let modifiedObjectsResponse = [];

  if (newObjects.length > 0) {
    newObjectsResponse = await fetch(createAPIRoute(`repo/${repoId}/object/`), {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newObjects),
    })
      .then((response) => response.json())
      .catch((e) => []);
  }

  if (modifiedObjects.length > 0) {
    modifiedObjectsResponse = await fetch(
      createAPIRoute(`repo/${repoId}/object/`),
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modifiedObjects),
      }
    )
      .then((response) => response.json())
      .catch((e) => []);
  }

  return {
    data: newObjectsResponse
      .concat(modifiedObjectsResponse)
      .map(translateApiNetworkObject),
  };
}

function translateNetworkObjectElement(
  objectElement: NetworkObjectElement
): ObjectElementAPI {
  switch (objectElement.type) {
    case "IPV4": {
      const ipv4 = objectElement as IPV4;
      return {
        ...objectElement,
        range_end: ipv4.ip,
        range_start: ipv4.ip,
      };
    }
    default: {
      const ipv4 = objectElement as IPV4RANGE;
      return {
        ...objectElement,
        range_end: ipv4.start,
        range_start: ipv4.end,
      };
    }
  }
}

// noinspection UnnecessaryLocalVariableJS
function translateApiNetworkObject(
  objectElementAPI: ObjectElementAPI
): NetworkObjectElement {
  if (objectElementAPI.range_start == objectElementAPI.range_end) {
    const object: IPV4 = {
      ...objectElementAPI,
      status: "source",
      ip: objectElementAPI.range_start,
      type: NetworkObjectType.IPV4,
    };
    return object;
  }

  const object: IPV4RANGE = {
    ...objectElementAPI,
    status: "source",
    start: objectElementAPI.range_start,
    end: objectElementAPI.range_end,
    type: NetworkObjectType.IPV4_RANGE,
  };

  return object;
}
