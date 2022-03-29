import type { NextApiHandler } from "next";
import {
  DIRECTION,
  POLICY,
  Rule,
  ServiceElement,
  Service,
  NetworkObjectElement,
  IPV4,
} from "../../types/types";

const ruleHandler: NextApiHandler = async (request, response) => {
  // simulate IO latency
  debugger;
  await new Promise((resolve) => setTimeout(resolve, 100));
  response.status(200).json({ data: ruleList() });
};

export default ruleHandler;

function ruleList(): Rule[] {
  const elements: Rule[] = Array.apply(null, Array(20)).map(
    (element: Rule, i: number): Rule => {
      return {
        id: i,
        name: `name: ${i}`,
        source: createDummyNetwork(),
        destination: createDummyNetwork(),
        service: createDummyService(),
        direction: DIRECTION.INBOUND,
        policy: POLICY.ACCEPT,
        comment: "test",
      };
    }
  );
  return elements;
}

function createDummyService(): ServiceElement {
  const service: Service = {
    id: `1`,
    name: "HTTP",
    protocol: "TCP",
    port: 80,
    comment: "",
  };

  return service;
}

function createDummyNetwork(): NetworkObjectElement {
  const ip: IPV4 = {
    id: `1`,
    name: "server",
    comment: "",
    ip: "192.168.1.110",
  };

  return ip;
}
