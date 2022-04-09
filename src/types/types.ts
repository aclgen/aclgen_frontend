export type EditableElementStatus = "modified" | "new" | "source" | "deleted";

export interface RuleElement extends EditableElement {
  name: string;
  comment: string;
  device: string;
}

export interface Rule extends RuleElement {
  source: NetworkObjectElement[];
  destination: NetworkObjectElement[];
  service: ServiceElement[];
  direction: DIRECTION;
  policy: POLICY;
}

export interface RuleGroup extends RuleElement {
  rules: RuleElement[];
}

export enum ServiceType {
  PORT,
  PORT_RANGE,
  PORT_GROUP,
}
export interface ServiceElement extends EditableElement {
  name: string;
  type: ServiceType;
  id: string;
  comment: string;
  status: EditableElementStatus;
}

export interface PortService extends ServiceElement {
  sourcePort: number;
  destinationPort: number;
  protocol: string;
}

export interface Nestable<T> {
  children: T[];
}

export interface ServiceGroup
  extends ServiceElement,
    Nestable<ServiceElement> {}

export interface EditableElement {
  status: EditableElementStatus;
  name: string;
  id: string;
}

export interface NetworkObjectElement extends EditableElement {
  id: string;
  name: string;
  comment: string;
}

export interface IPV4 extends NetworkObjectElement {
  ip: string;
}

export interface IPV4RANGE extends NetworkObjectElement {
  start: string;
  end: string;
}

export interface IPGROUP extends NetworkObjectElement {
  elements: NetworkObjectElement[];
}

export enum POLICY {
  ACCEPT,
  DENY,
}

export enum DIRECTION {
  INBOUND,
  OUTBOUND,
}
