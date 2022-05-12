import React from "react";
import {
  EditableElement,
  NetworkObjectElement,
  ServiceElement,
} from "../../types/types";
import { DroppableInputField } from "../InputField/DroppableField";
import { PopUpForm, PopUpFormProps } from "./PopUpForm";
import { CheckIcon, Name, TrashIcon, Type } from "./ServiceCreationForm";
import { Comment } from "../../components/rule/RuleCard";
import { useAppSelector } from "../../app/hooks";
import { selectDraggable } from "../../features/draggable/draggableSlice";

export interface RuleCreationPopupProps extends PopUpFormProps {
  isVisible: boolean;
  name: string;
  element: EditableElement;
  setName: (name: string) => void;
  comment: string;
  setComment: (comment: string) => void;
  source: NetworkObjectElement[];
  destination: NetworkObjectElement[];
  sourceService: ServiceElement[];
  destinationService: ServiceElement[];
  setSource: (element: NetworkObjectElement[]) => void;
  setDestination: (element: NetworkObjectElement[]) => void;
  setSourceService: (element: ServiceElement[]) => void;
  setDestinationService: (element: ServiceElement[]) => void;
  onCreateNewObject: (name: string) => void;
  onCreateNewService: (name: string) => void;
  searchAbleElements: ServiceElement[];
  searchAbleObjects: NetworkObjectElement[];
  onSubmit: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function RulePopUpForm({ rule }: { rule: RuleCreationPopupProps }) {
  const dragState = useAppSelector(selectDraggable).currentDraggedItem;

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
          <Type name="Rule" />
          <Name
            value={rule.name}
            onChange={(name) => rule.setName(name)}
            isFocus={true}
          />
          <DroppableInputField
            expanded={true}
            setExpanded={() => {}}
            droppableType={"object"}
            inputID={rule.element.id + "sourceinput"}
            fieldType={"SOURCE"}
            elements={rule.source}
            searchAbleElements={rule.searchAbleObjects}
            onCreateNewElement={rule.onCreateNewObject}
            onUpdateElements={rule.setSource}
            disabled={dragState !== undefined && dragState.type !== "object"}
          />
          <DroppableInputField
            expanded={true}
            setExpanded={() => {}}
            droppableType={"service"}
            inputID={rule.element.id + "sourceServiceInput"}
            fieldType={"SERVICE"}
            elements={rule.sourceService}
            searchAbleElements={rule.searchAbleElements}
            onCreateNewElement={rule.onCreateNewService}
            onUpdateElements={rule.setSourceService}
            disabled={dragState !== undefined && dragState.type !== "service"}
          />
          <DroppableInputField
            expanded={true}
            setExpanded={() => {}}
            droppableType={"object"}
            inputID={rule.element.id + "destinationinput"}
            fieldType={"DESTINATION"}
            elements={rule.destination}
            searchAbleElements={rule.searchAbleObjects}
            onCreateNewElement={rule.onCreateNewObject}
            onUpdateElements={rule.setDestination}
            disabled={dragState !== undefined && dragState.type !== "object"}
          />

          <DroppableInputField
            expanded={true}
            setExpanded={() => {}}
            droppableType={"service"}
            inputID={rule.element.id + "destinationServiceInput"}
            fieldType={"SERVICE"}
            elements={rule.destinationService}
            searchAbleElements={rule.searchAbleElements}
            onCreateNewElement={rule.onCreateNewService}
            onUpdateElements={rule.setDestinationService}
            disabled={dragState !== undefined && dragState.type !== "service"}
          />
          <Comment
            value={rule.comment}
            onChange={(comment: string) => rule.setComment(comment)}
          />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon
            onClick={rule.onSubmit}
            disabled={
              rule.destinationService.length === 0 &&
              rule.sourceService.length === 0 &&
              rule.source.length === 0 &&
              rule.destination.length === 0
            }
          />
          {rule.onDelete ? <TrashIcon onClick={rule.onDelete} /> : <></>}
        </div>
      </form>
    </PopUpForm>
  );
}
