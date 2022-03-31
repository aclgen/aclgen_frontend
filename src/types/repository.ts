import RuleSet, {
  NetworkObjectElement,
  RuleElement,
  ServiceElement,
} from "./types";

export type Repository = {
  UUID: string;
  access: ACCESS;
  repo: string;
  description: string;
  logo: string;
  workSpace: WorkSpace;
  networkObjects: NetworkObjectElement[];
  Services: ServiceElement[];
};

interface WorkSpace {}

interface Location extends NetworkElement {
  elements: NetworkElement[];
}

interface NetworkElement {
  name: string;
}

interface WorkspaceFolder extends NetworkElement {
  elements: NetworkElement[];
}

interface Cluster<T extends NetworkDevice> extends NetworkElement {
  elements: T[];
}

interface FireWall extends NetworkDevice {
  rules: RuleSet;
}

interface NetworkDevice extends NetworkElement {}

enum ACCESS {
  PUBLIC,
  PRIVATE,
  SHARED,
}
