import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  DIRECTION,
  NetworkObjectElement,
  POLICY,
  Rule,
  ServiceElement,
} from "../../types/types";
import { createNewRule, selectRule } from "./ruleSlice";
import { v4 as uuidv4 } from "uuid";
import {
  RuleCreationPopupProps,
  RulePopUpForm,
} from "../../components/creationForm/RulePopupForm";
import {
  initiateNewObject,
  selectNetworkObjects,
} from "../networkObject/DraftNetworkObjectSlice";
import {
  cancelCreationPopUp,
  initiateNewService,
  initiatePopUp,
  selectService,
} from "../service/DraftServiceSlice";
import { LockStatus } from "../../types/repository";

function RuleCreationPopUp() {
  const dispatch = useAppDispatch();
  const rulestate = useAppSelector(selectRule);
  const serviceState = useAppSelector(selectService);
  const networkObjectState = useAppSelector(selectNetworkObjects);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [sourceServices, setSourceServices] = useState([]);
  const [destinationServices, setDestinationServices] = useState([]);
  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const [direction, setDirection] = useState(DIRECTION.INBOUND);
  const [policy, setPolicy] = useState(POLICY.ACCEPT);
  const id = uuidv4();

  const newRule: Rule = {
    sources: source,
    destinations: destination,
    destinationServices: destinationServices,
    sourceServices: sourceServices,
    direction: direction,
    policy: policy,
    name: name,
    comment: comment,
    device: "",
    status: "new",
    id: id,
    lock: LockStatus.UNLOCKED,
  };

  const ruleProps: RuleCreationPopupProps = {
    isVisible: rulestate.newRuleStatus === "creating",
    name: name,
    element: newRule,
    setName: function (name: string): void {
      setName(name);
    },
    comment: comment,
    setComment: function (comment: string): void {
      setComment(comment);
    },
    source: source,
    destination: destination,
    sourceService: sourceServices,
    destinationService: destinationServices,
    setSource: function (element: NetworkObjectElement[]): void {
      setSource(element);
    },
    setDestination: function (element: NetworkObjectElement[]): void {
      setDestination(element);
    },
    setSourceService: function (element: ServiceElement[]): void {
      setSourceServices(element);
    },
    setDestinationService: function (element: ServiceElement[]): void {
      setDestinationServices(element);
    },
    onCreateNewObject: function (name: string): void {
      dispatch(initiatePopUp());
      dispatch(initiateNewObject(name));
    },
    onCreateNewService: function (name: string): void {
      dispatch(initiatePopUp());
      dispatch(initiateNewService({ name: name }));
    },
    searchAbleElements: serviceState.services,
    searchAbleObjects: networkObjectState.networkObjects,
    onSubmit: function (): void {
      dispatch(initiatePopUp());
      dispatch(createNewRule(newRule));
    },
    onCancel: () => {
      dispatch(initiatePopUp());
      dispatch(cancelCreationPopUp());
    },
  };

  return <RulePopUpForm rule={ruleProps} />;
}

const TrashIcon = () => {
  return (
    <div>
      <img src="/square.svg" className=" mr-3 h-6" />
    </div>
  );
};

const CheckIcon = ({ onClick }: { onClick: () => void }) => {
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

export default RuleCreationPopUp;
