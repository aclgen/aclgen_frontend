export interface RepositoryIdentifier {
  id: string;
  name: string;
}

export interface RuleIdentifier {
  id: string;
  name: string;
  comment: string;
  device: string;
  repository: string;
  source: string;
  destination: string;
  service: string;
  direction: string;
  action: string;
}
