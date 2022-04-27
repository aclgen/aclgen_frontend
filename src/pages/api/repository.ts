import type { NextApiHandler } from "next";
import {
  ACCESS,
  FireWall,
  Repository,
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
    id: uuidv4(),
    access: ACCESS.SHARED,
    repo: "Test Repo",
    description: "repo used for internal testing",
    logo: "logo",
    workSpace: [],
    networkObjects: [createDummyNetwork()],
    services: [createDummyService()],
  };

  return repo;
}

