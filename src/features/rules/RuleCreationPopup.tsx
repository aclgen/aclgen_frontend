import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import rule from "../../components/rule";
import {
  Source,
  Destination,
  ServiceInput,
  Direction,
  Policy,
  Name,
  Label,
  Comment,
} from "../../components/rule/RuleCard";
import { DIRECTION, IPV4, POLICY, Rule, Service } from "../../types/types";
import { createNewRule, selectRule } from "./ruleSlice";

function ServiceCreationPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectRule);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [index, setIndex] = useState(state.rules.length);
  const [source, setSource] = useState(defaultIP);
  const [destination, setDestination] = useState(defaultIP);
  const [direction, setDirection] = useState(DIRECTION.INBOUND);
  const [service, setService] = useState(defaultService);
  const [policy, setPolicy] = useState(POLICY.ACCEPT);

  return (
    <div
      className={`${
        state.newRuleStatus === "creating" ? "scale-100 h-fit" : "scale-y-0 h-0"
      } absolute inset-x-0  bottom-2 transform origin-bottom  duration-300 transition`}
    >
      <div className="mx-auto px-4 h-24 container bg-slate-100 shadow-lg rounded-md border-2 border-blue-400 flex-row items-center">
        <form
          className="space-y-2 flex flex-row justify-between space-x-4"
          action="#"
        >
          <div className="space-y-2 flex justify-self-start flex-row justify-between space-x-4 ">
            <Index value={index} />
            <Name value={name} onChange={setName} />
            <Source value={source} onChange={(data: IPV4) => setSource(data)} />
            <Destination
              value={destination}
              onChange={(data: IPV4) => setDestination(data)}
            />
            <ServiceInput
              value={service}
              onChange={(data: Service) => setService(data)}
            />
            <Direction
              value={direction}
              onChange={(data: DIRECTION) => setDirection(data)}
            />
            <Policy
              value={policy}
              onChange={(data: POLICY) => setPolicy(data)}
            />
            <Comment value={comment} onChange={setComment} />
          </div>
          <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
            <CheckIcon
              onClick={() => {
                const newRule: Rule = {
                  source: source,
                  destination: destination,
                  service: service,
                  direction: direction,
                  policy: policy,
                  name: name,
                  comment: comment,
                  id: index,
                };
                dispatch(createNewRule(newRule));
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export const defaultClass: string =
  "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none";

export const Index: React.FC<{ value: number }> = ({ value }) => (
  <p className="block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white">
    {`#${value}`}
  </p>
);

export const TrashIcon = () => {
  return (
    <div>
      <img src="/square.svg" className=" mr-3 h-6" />
    </div>
  );
};

export const CheckIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="border-2 border-gray-100 rounded-md hover:cursor-pointer hover:border-blue-400 h-10 w-10 hover:shadow-lg"
    >
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        className="h-8 pt-1 pl-1"
      >
        <path
          d="M504.502,75.496c-9.997-9.998-26.205-9.998-36.204,0L161.594,382.203L43.702,264.311c-9.997-9.998-26.205-9.997-36.204,0
			c-9.998,9.997-9.998,26.205,0,36.203l135.994,135.992c9.994,9.997,26.214,9.99,36.204,0L504.502,111.7
			C514.5,101.703,514.499,85.494,504.502,75.496z"
          className="fill-blue-700"
        ></path>
      </svg>
    </div>
  );
};

export const Type = () => (
  <div>
    <Label value="TYPE" />
    <h2
      className={
        "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none"
      }
    >
      Rule
    </h2>
  </div>
);

export const defaultService: Service = {
  port: 0,
  protocol: "",
  name: "",
  id: "0",
  comment: "",
};

export const defaultIP: IPV4 = {
  ip: "",
  id: "0",
  name: "",
  comment: "",
};

export default ServiceCreationPopup;
