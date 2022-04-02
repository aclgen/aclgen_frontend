import type { NextApiHandler } from "next";
import {
  ACCESS,
  FireWall,
  Repository,
  WorkSpace,
} from "../../types/repository";
import { createDummyNetwork, createDummyService, ruleList } from "./rules";

const ruleHandler: NextApiHandler = async (request, response) => {
  // simulate IO latency
  debugger;
  await new Promise((resolve) => setTimeout(resolve, 100));
  response.status(200).json({ data: repoList() });
};

export default ruleHandler;

function repoList(): Repository[] {
  const elements: Repository[] = Array.apply(null, Array(1)).map(
    (element: Repository, i: number): Repository => {
      return createDummyRepository();
    }
  );
  return elements;
}

function createDummyRepository(): Repository {
  const repo: Repository = {
    UUID: "TestRepo",
    access: ACCESS.SHARED,
    repo: "Test Repo",
    description: "repo used for internal testing",
    logo: "logo",
    workSpace: createDefaultWorkspace(),
    networkObjects: [createDummyNetwork()],
    services: [createDummyService()],
  };

  return repo;
}

function createDefaultWorkspace(): WorkSpace {
  const firewall: FireWall = {
    name: "Default FireWall",
    rules: {
      id: "1",
      rules: ruleList(),
      name: "Default Firewall",
    },
    type: "firewall",
    status: "source",
    id: "123",
  };

  const workspace: WorkSpace = {
    children: [firewall, { ...firewall, id: "1234" }],
    status: "source",
    id: "1234",
  };
  return workspace;
}
