import { DIRECTION, EditableElementStatus, POLICY } from "./types";
import { LockStatus } from "./repository";

export interface ServiceElementAPI extends BaseElementAPI {
  repository?: string;
  port_start: number;
  port_end: number;
  protocol: string;
  lock: LockStatus;
}

export interface ObjectElementAPI extends BaseElementAPI {
  repository?: string;
  range_start: string;
  range_end: string;
  lock: LockStatus;
}

export interface RuleElementAPI extends BaseElementAPI {
  device: string;
  sources: string[];
  destinations: string[];
  services_sources: string[];
  services_destinations: string[];
  direction: DIRECTION;
  action: POLICY;
  folder: string;
  lock: LockStatus;
}

export interface DeviceElementAPI extends BaseElementAPI {
  repository: string;
  type: "FIREWALL";
  status: EditableElementStatus;
}

export interface RepoElementAPI extends BaseElementAPI {}

export interface BaseElementAPI {
  comment: string;
  name: string;
  id: string;
  created_on?: string;
  modifier_on?: string;
}
