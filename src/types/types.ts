export type RuleSet = {
  id: string;
  name: string;
  rules: RuleElement[];
};

export interface RuleElement {
  name: string;
  comment: string;
  id: number;
}

export interface Rule extends RuleElement {
  source: NetworkObjectElement;
  destination: NetworkObjectElement;
  service: ServiceElement;
  direction: DIRECTION;
  policy: POLICY;
}

export interface RuleGroup extends RuleElement {
  rules: RuleElement[];
}

export interface ServiceElement {
  name: string;
  id: string;
  comment: string;
}

export interface Service extends ServiceElement {
  port: number;
  protocol: string;
}

export interface ServiceGroup extends ServiceElement {
  elements: ServiceElement[];
}

export interface NetworkObjectElement {
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

export default RuleSet;
