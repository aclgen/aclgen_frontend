import { useTheme } from "next-themes";
import Head from "next/head";
import RuleCard from "../../components/rule/RuleCard";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectRule,
  updateRules,
  updateAsync,
} from "../../features/rules/ruleSlice";
import { useCallback } from "react";
import { Rule, RuleElement } from "../../types/types";
import update from "immutability-helper";

function ListView() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRule);

  if (state.status === "empty") {
    dispatch(updateAsync());
  }

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    dispatch(
      updateRules((prevCards: RuleElement[]) => {
        return update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        });
      })
    );
  }, []);

  const renderCard = useCallback((rule: Rule, index: number) => {
    return (
      <RuleCard key={rule.id} index={index} moveCard={moveCard} rule={rule} />
    );
  }, []);

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
          {state.rules
            .map((ruleElement) => ruleElementtoRule(ruleElement))
            .map((card, i) => renderCard(card, i))}
        </div>
      </div>
    </div>
  );
}

function ruleElementtoRule(element: RuleElement): Rule {
  //@ts-ignore
  return element;
}

export default ListView;
function setCards(
  arg0: (prevCards: Item[]) => { payload: rule[]; type: string }
) {
  throw new Error("Function not implemented.");
}
