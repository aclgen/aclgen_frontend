import {
  EditableElement,
  Nestable,
  NetworkObjectElement,
  RuleElement,
  ServiceElement,
} from "./types";

export interface Repository {
  id: string;
  access: ACCESS;
  repo: string;
  description: string;
  logo: string;
  workSpace: NetworkElement[];
  networkObjects: NetworkObjectElement[];
  services: ServiceElement[];
}

export interface Location extends NetworkElement, Nestable<NetworkElement> {}

export interface NetworkElement extends EditableElement {
  name: string;
  type: string;
}

export interface WorkspaceFolder extends NetworkElement {
  elements: NetworkElement[];
  type: "workspace";
}

export interface Cluster<T extends NetworkDevice> extends NetworkElement {
  elements: T[];
  type: "cluster";
}

export interface FireWall extends NetworkDevice {
  rules: RuleElement[];
  type: "firewall";
}

export interface NetworkDevice extends NetworkElement {}

export enum ACCESS {
  PUBLIC,
  PRIVATE,
  SHARED,
}

export enum LockStatus {
  LOCKED = "LOCKED",
  UNLOCKED = "UNLOCKED",
  IMMUTABLE = "IMMUTABLE",
}
