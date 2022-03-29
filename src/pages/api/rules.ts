import type { NextApiHandler } from "next";
import { rule } from "../../features/rules/ruleSlice";

const ruleHandler: NextApiHandler = async (request, response) => {
  // simulate IO latency
  debugger;
  await new Promise((resolve) => setTimeout(resolve, 100));
  response.status(200).json({ data: ruleList() });
};

export default ruleHandler;

function ruleList(): rule[] {
  const elements = Array.apply(null, Array(20)).map(
    (element: undefined, i: number) => {
      return {
        name: `name: ${i}`,
        source: "192.168.1.123",
        destination: "192.168.1.1",
      };
    }
  );
  return elements;
}
