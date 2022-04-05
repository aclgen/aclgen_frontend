import { NetworkElement } from "../../types/repository";
import { NetworkObjectElement, Rule, ServiceElement } from "../../types/types";

export interface RuleTransaction {
  parentId: string;
  rules: Rule[];
}

export interface ServiceTransaction {
  services: ServiceElement[];
}

export interface ObjectTransaction {
  objects: NetworkObjectElement[];
}

export interface WorkSpaceTransaction {
  children: NetworkElement[];
}

export interface BatchTransaction {
  services: ServiceTransaction | undefined;
  rules: RuleTransaction | undefined;
  objects: ObjectTransaction | undefined;
  workSpace: WorkSpaceTransaction | undefined;
}
