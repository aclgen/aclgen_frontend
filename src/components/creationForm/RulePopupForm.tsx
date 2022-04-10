import React from "react";
import {
  EditableElement,
  NetworkObjectElement,
  ServiceElement,
} from "../../types/types";
import { DroppableInputField } from "../InputField/DroppableField";
import { PopUpForm, PopUpFormProps } from "./PopUpForm";
import { Type, Name, CheckIcon, TrashIcon } from "./ServiceCreationForm";
import { Comment } from "../../components/rule/RuleCard";

export interface RuleCreationPopupProps extends PopUpFormProps {
  isVisible: boolean;
  name: string;
  element: EditableElement;
  setName: (name: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  source: NetworkObjectElement[];
  destination: NetworkObjectElement[];
  service: ServiceElement[];
  setSource: (element: NetworkObjectElement[]) => void;
  setDestination: (element: NetworkObjectElement[]) => void;
  setService: (element: ServiceElement[]) => void;
  onCreateNewObject: (name: string) => void;
  onCreateNewService: (name: string) => void;
  searchAbleElements: ServiceElement[];
  searchAbleObjects: NetworkObjectElement[];
  onSubmit: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function RulePopUpForm({ rule }: { rule: RuleCreationPopupProps }) {
  return (
    <PopUpForm popUp={rule}>
      <form
        className="space-y-3 py-1  px-6 flex flex-row justify-between space-x-4"
        action="#"
      >
        <div className="flex justify-self-start items-center flex-row justify-between space-x-4 ">
          <img
            className="h-8 mt-5"
            src={"/computer-networks.svg"}
            alt={"Service"}
          />
          <Type />
          <Name value={rule.name} onChange={(name) => rule.setName(name)} />
          <DroppableInputField
            droppableType={"object"}
            inputID={rule.element.id + "sourceinput"}
            fieldType={"SOURCE"}
            elements={rule.source}
            searchAbleElements={rule.searchAbleObjects}
            onCreateNewService={rule.onCreateNewObject}
            onUpdateElements={rule.setSource}
          />
          <DroppableInputField
            droppableType={"object"}
            inputID={rule.element.id + "destinationinput"}
            fieldType={"DESTINATION"}
            elements={rule.destination}
            searchAbleElements={rule.searchAbleObjects}
            onCreateNewService={rule.onCreateNewObject}
            onUpdateElements={rule.setDestination}
          />
          <DroppableInputField
            droppableType={"service"}
            inputID={rule.element.id + "serviceinput"}
            fieldType={"SERVICE"}
            elements={rule.service}
            searchAbleElements={rule.searchAbleElements}
            onCreateNewService={rule.onCreateNewService}
            onUpdateElements={rule.setService}
          />
          <Comment
            value={rule.comment}
            onChange={(comment: string) => rule.setComment(comment)}
          />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon onClick={rule.onSubmit} />
          {rule.onDelete ? <TrashIcon onClick={rule.onDelete} /> : <></>}
        </div>
      </form>
    </PopUpForm>
  );
}
