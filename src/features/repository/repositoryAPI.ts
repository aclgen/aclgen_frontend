import { Repository } from "../../types/repository";

export async function fetchRepositories(): Promise<{
  data: Repository[];
}> {
  const response = await fetch("/api/repository", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const result = await response.json();
  return result;
}
