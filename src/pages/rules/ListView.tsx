import { useTheme } from "next-themes";
import Head from "next/head";
import RuleCard from "../../components/rule/RuleCard";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  rule,
  selectRule,
  update,
  updateAsync,
} from "../../features/rules/ruleSlice";

function ListView() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRule);

  if (state.status === "empty") {
    dispatch(updateAsync());
  }

  return (
    <div className="flex flex-1 overflow-y-auto">
      <div className="grid grid-flow-col space-4 w-full">
        <div className="flex flex-1 overflow-y-auto">
          <div className="flex flex-1 flex-col overflow-y-auto border-r">
            <div className="flex flex-1 flex-wrap justify-cente p-3 overflow-y-auto">
              Sidebar
            </div>
          </div>
        </div>
        <div className="px-4 overflow-y-auto w-full flex flex-col space-y-2 pt-4">
          <Elements />
        </div>
      </div>
    </div>
  );
}

function Elements() {
  const state = useAppSelector(selectRule);
  const elements = state.rules.map((element: rule, i: number) => {
    return RuleCard(i, element.name, element.source, element.destination);
  });
  return <>{elements}</>;
}

export default ListView;
