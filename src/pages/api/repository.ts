import type { NextApiHandler } from "next";
import {
  ACCESS,
  FireWall,
  Repository,
  WorkSpace,
} from "../../types/repository";
import { createDummyNetwork, createDummyService, ruleList } from "./rules";
import { v4 as uuidv4 } from "uuid";

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
    UUID: uuidv4(),
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
  const workSpaceId = uuidv4();
  const firewall: FireWall = {
    name: "Default FireWall",
    rules: {
      id: uuidv4(),
      parentId: workSpaceId,
      rules: ruleList(),
      name: "Default Firewall",
    },
    type: "firewall",
    status: "source",
    id: workSpaceId,
  };

  const workspace: WorkSpace = {
    children: [firewall, { ...firewall, id: uuidv4() }],
    status: "source",
    id: uuidv4(),
  };
  return workspace;
}
