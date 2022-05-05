import RuleCard from "../../components/rule/RuleCard";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import ruleSlice, {
  selectRule,
  initiateNewRule,
  setRules,
  modifyRuleWithIndex,
} from "../../features/rules/ruleSlice";
import { useEffect, useState } from "react";
import { Rule, RuleElement } from "../../types/types";
import SideBar from "../../features/sidebar/SideBar";
import {
  saveRulesAsync,
  selectDraftRepository,
} from "../../features/repository/DraftRepositorySlice";
import { FireWall } from "../../types/repository";
import CountableCheckButton from "../../components/CountableCheckButton";
import { initiatePopUp } from "../../features/service/DraftServiceSlice";
import { Virtuoso } from "react-virtuoso";
import React from "react";

function ListView() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-1 ">
      <div className="grid grid-flow-col auto-cols-auto space-4 w-full">
        <div className="flex flex-1 flex-col col-span-1 scrollbar border-r overflow-x-visible content-area  overflow-y-scroll">
          <div className="flex flex-1 relative p-3 basis-1/4 overflow-y-auto ">
            <SideBar />
          </div>
        </div>
        <div className="px-4 flex flex-col space-y-2 content-area py-2 col-span-6">
          <div className="container flex flex-row items-center space-x-2 bg-white container-xl transition-opacity rounded-md border-2 border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
            <button
              className="outline-none h-10 "
              onClick={() => {
                dispatch(initiatePopUp());
                dispatch(initiateNewRule());
              }}
            >
              <PlusButtonSVG />
            </button>
            <SaveRulesCountButton />
          </div>
          <RuleList />
        </div>
      </div>
    </div>
  );
}

function RuleList() {
  const state = useAppSelector(selectRule);
  const draftRepoState = useAppSelector(selectDraftRepository);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (state.status === "empty" && draftRepoState.status == "idle") {
      const firewall = draftRepoState.repository.workSpace[0] as FireWall;
      dispatch(setRules(firewall.rules));
    }
  });

  const renderCard = (rule: Rule, index: number) => {
    return (
      <RuleCard
        key={index}
        index={index}
        rule={rule}
        modifyCard={(card) =>
          dispatch(modifyRuleWithIndex({ rule: card, index }))
        }
      />
    );
  };

  const RuleEntry = (index: number) => {
    return renderCard(state.rules[index] as Rule, index);
  };

  return (
    <Virtuoso
      totalCount={state.rules.length}
      overscan={1200}
      increaseViewportBy={400}
      itemContent={(index) => RuleEntry(index)}
    ></Virtuoso>
  );
}

export function SaveRulesCountButton() {
  const state = useAppSelector(selectRule);
  const dispatch = useAppDispatch();

  const [modified, setModified] = useState(0);
  useEffect(() => {
    setModified(
      state.rules
        .map((element) => (element.status === "source" ? 0 : 1))
        .reduce((prev, next) => prev + next, 0)
    );
  }, [state.rules]);

  function onClick() {
    const services = state.rules.filter(
      (element) => element.status !== "source"
    );
    dispatch(saveRulesAsync(services));
  }

  return (
    <>
      {modified > 0 ? (
        <div className={"ml-auto"}>
          <CountableCheckButton
            number={modified}
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export function PlusButtonSVG({ onClick }: { onClick?: () => void }) {
  return (
    <svg
      onClick={onClick === undefined ? () => {} : onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-8 pt-1 pl-4 ml-auto items-end group hover:cursor-pointer"
    >
      <path
        d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0"
        className="group-hover:fill-blue-600 fill-white group-hover:shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <path
        d="m368 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0"
        className="fill-blue-600 group-hovver:fill-white opacity-100 group-hover:opacity-0"
      />
      <path
        d="m368 277.332031h-90.667969v90.667969c0 11.777344-9.554687 21.332031-21.332031 21.332031s-21.332031-9.554687-21.332031-21.332031v-90.667969h-90.667969c-11.777344 0-21.332031-9.554687-21.332031-21.332031s9.554687-21.332031 21.332031-21.332031h90.667969v-90.667969c0-11.777344 9.554687-21.332031 21.332031-21.332031s21.332031 9.554687 21.332031 21.332031v90.667969h90.667969c11.777344 0 21.332031 9.554687 21.332031 21.332031s-9.554687 21.332031-21.332031 21.332031zm0 0"
        className="fill-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </svg>
  );
}

export default ListView;
