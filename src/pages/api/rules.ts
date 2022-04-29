import type { NextApiHandler } from "next";
import {
  DIRECTION,
  POLICY,
  Rule,
  ServiceElement,
  PortService,
  NetworkObjectElement,
  IPV4,
  ServiceType,
} from "../../types/types";
import { v4 as uuidv4 } from "uuid";

const ruleHandler: NextApiHandler = async (request, response) => {
  // simulate IO latency
  debugger;
  await new Promise((resolve) => setTimeout(resolve, 100));
  response.status(200).json({ data: ruleList() });
};

export default ruleHandler;

export function ruleList(): Rule[] {
  const elements: Rule[] = Array.apply(null, Array(20)).map(
    (element: Rule, i: number): Rule => {
      const rule: Rule = {
        id: uuidv4(),
        name: `name: ${i}`,
        sources: [],
        destinations: [],
        services: [],
        direction: DIRECTION.INBOUND,
        policy: POLICY.ACCEPT,
        comment: "test",
        status: "source",
        device: ""
      };
      return rule;
    }
  );
  return elements;
}

export function createDummyService(): ServiceElement {
  const service: PortService = {
    id: uuidv4(),
    name: "HTTP",
    protocol: "TCP",
    sourcePort: 80,
    destinationPort: 80,
    status: "source",
    comment: "",
    type: ServiceType.PORT,
  };

  return service;
}

export function createDummyNetwork(): NetworkObjectElement {
  const ip: IPV4 = {
    id: uuidv4(),
    name: "server",
    comment: "",
    ip: "192.168.1.110",
    status: "source",
  };

  return ip;
}
