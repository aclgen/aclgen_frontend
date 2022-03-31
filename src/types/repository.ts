import RuleSet, {
  NetworkObjectElement,
  RuleElement,
  ServiceElement,
} from "./types";

export interface Repository {
  UUID: string;
  access: ACCESS;
  repo: string;
  description: string;
  logo: string;
  workSpace: WorkSpace;
  networkObjects: NetworkObjectElement[];
  Services: ServiceElement[];
}

export interface WorkSpace {
  elements: NetworkElement[];
}

export interface Location extends NetworkElement {
  elements: NetworkElement[];
}

export interface NetworkElement {
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
  rules: RuleSet;
  type: "firewall";
}

export interface NetworkDevice extends NetworkElement {}

export enum ACCESS {
  PUBLIC,
  PRIVATE,
  SHARED,
}
