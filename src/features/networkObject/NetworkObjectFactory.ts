import {
  IPV4,
  IPV4RANGE,
  NetworkObjectElement,
  NetworkObjectType,
} from "../../types/types";
import { ObjectEditingBase } from "./ObjectCreationPopup";
import { StringInputHandler } from "../input/baseInput";
import { v4 as uuidv4 } from "uuid";
import { LockStatus } from "../../types/repository";
import { IpRangeInputHandler } from "./NetworkInputHandler";

export function createNewNetworkObjectFromInput(
  object: NetworkObjectElement,
  base: ObjectEditingBase,
  input: StringInputHandler | IpRangeInputHandler
): NetworkObjectElement {
  switch (base.type) {
    case NetworkObjectType.IPV4: {
      const handler = input as StringInputHandler;
      const newObject: IPV4 = { ...object, ...base, ip: handler.inputValue };
      return newObject;
    }
    case NetworkObjectType.IPV4_RANGE: {
      const handler = input as IpRangeInputHandler;
      const newObject: IPV4RANGE = {
        ...object,
        ...base,
        start: handler.ipFromInputHandler.inputValue,
        end: handler.ipToInputHandler.inputValue,
      };
      return newObject;
    }
  }
}

export function createNetworkObjectElement(object: any): NetworkObjectElement {
  return {
    comment: object.comment ? object.comment : "",
    id: object.id ? object.id : uuidv4(),
    lock: object.lock ? object.lock : LockStatus.UNLOCKED,
    name: object.name ? object.name : "",
    status: object.status ? object.status : "new",
    type: object.type ? object.type : NetworkObjectType.IPV4,
  };
}

export function initiateNewNetworkObject(element: any): NetworkObjectElement {
  if (element.type && element.type == NetworkObjectType.IPV4_RANGE) {
    const newObject: IPV4RANGE = {
      ...createNetworkObjectElement(element),
      id: element.id ? element.id : uuidv4(),
      start: element.start ? element.start : "0.0.0.0",
      end: element.end ? element.end : "0.0.0.0",
    };
    return newObject;
  } else {
    const newObject: IPV4 = {
      ...createNetworkObjectElement(element),
      id: element.id ? element.id : uuidv4(),
      ip: element.ip ? element.ip : "0.0.0.0",
    };
    return newObject;
  }
}
