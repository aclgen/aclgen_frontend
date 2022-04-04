import { NextApiHandler } from "next";

const commitServicesHandler: NextApiHandler = async (request, response) => {
  // simulate IO latency
  debugger;
  await new Promise((resolve) => setTimeout(resolve, 100));
  response.status(200).json({ data: [...request.body.services] });
};

export default commitServicesHandler;
