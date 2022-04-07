import { ACCESS, Repository } from "../../types/repository";

const EmptyRepository: Repository = {
  id: "EMPTY",
  access: ACCESS.PUBLIC,
  repo: "EMPTY",
  description: "Empty repository",
  logo: "EMPTY",
  workSpace: [],
  networkObjects: [],
  services: [],
};

export default EmptyRepository;
