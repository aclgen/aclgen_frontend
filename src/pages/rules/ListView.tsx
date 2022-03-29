import { useTheme } from "next-themes";
import Head from "next/head";
import RuleCard from "../../components/rule/RuleCard";

function ListView() {
  return (
    <div className="flex flex-1 overflow-y-auto">
      <div className="grid grid-flow-col space-4">
        <div className="flex flex-1 overflow-y-auto">
          <div className="flex flex-1 flex-col overflow-y-auto border-r">
            <div className="flex flex-1 flex-wrap justify-cente p-3 overflow-y-auto">
              Sidebar
            </div>
          </div>
        </div>
        <div className="px-4 overflow-y-auto flex flex-col space-y-2 pt-4">
          <Elements />
        </div>
      </div>
    </div>
  );
}

function Elements() {
  const elements = Array.apply(null, Array(20)).map(
    (element: undefined, i: number) => {
      return RuleCard(i);
    }
  );
  return <>{elements}</>;
}

export default ListView;
