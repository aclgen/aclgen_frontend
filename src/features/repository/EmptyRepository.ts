import { ACCESS, Repository } from "../../types/repository";

const EmptyRepository: Repository = {
  UUID: "EMPTY",
  access: ACCESS.PUBLIC,
  repo: "EMPTY",
  description: "Empty repository",
  logo: "EMPTY",
  workSpace: { elements: [] },
  networkObjects: [],
  Services: [],
};

export default EmptyRepository;
