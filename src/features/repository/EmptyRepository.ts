import { ACCESS, Repository } from "../../types/repository";

const EmptyRepository: Repository = {
  UUID: "EMPTY",
  access: ACCESS.PUBLIC,
  repo: "EMPTY",
  description: "Empty repository",
  logo: "EMPTY",
  workSpace: { children: [], status: "source", id: "123" },
  networkObjects: [],
  services: [],
};

export default EmptyRepository;
