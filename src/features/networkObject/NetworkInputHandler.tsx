import { useState } from "react";
import {
  createMessage,
  InputValidationResult,
  specialInputConditions,
  StringInputHandler,
  useStringInputHandler,
} from "../input/baseInput";
import { NetworkObjectElement, NetworkObjectType } from "../../types/types";
import { ObjectEditingBase } from "./ObjectCreationPopup";

export function useIpRangeInputHandler(
  ipFrom: string = "",
  ipTo: string = "",
  specialInputHandler?: specialInputConditions
): IpRangeInputHandler {
  const ipFromInputHandler = useStringInputHandler(
    ipFrom,
    specialInputHandler,
    validateIp
  );

  const ipToInputHandler = useStringInputHandler(
    ipTo,
    specialInputHandler,
    validateIp
  );

  function setInputValue(
    input1: string,
    input2: string,
    inputHandler: (input: string) => void
  ): void {
    specialInputHandler?.handleDualInput(input1, input2);

    inputHandler(input1);
  }

  return {
    ipFromInputHandler: {
      ...ipFromInputHandler,
      setInputValue: (input) =>
        setInputValue(
          input,
          ipToInputHandler.inputValue,
          ipFromInputHandler.setInputValue
        ),
    },
    ipToInputHandler: {
      ...ipToInputHandler,
      setInputValue: (input) =>
        setInputValue(
          input,
          ipFromInputHandler.inputValue,
          ipToInputHandler.setInputValue
        ),
    },
  };
}

export function validateIp(input: string): InputValidationResult {
  if (input.split(".").length === 4) {
    return createMessage(true);
  } else {
    return createMessage(false, "Invalid IPV4 input");
  }
}

export function useObjectEditingBase(
  object: NetworkObjectElement,
  updateObjectType: (type: NetworkObjectType) => void
): ObjectEditingBase {
  const [name, setName] = useState(object.name);
  const [comment, setComment] = useState(object.comment);
  const [type, setlocalType] = useState(object.type);

  const status = object.status === "new" ? "new" : "modified";

  function setType(type: NetworkObjectType) {
    updateObjectType(type);
    setlocalType(type);
  }
  return { name, setName, comment, setComment, type, setType, status };
}

export type IpRangeInputHandler = {
  ipFromInputHandler: StringInputHandler;
  ipToInputHandler: StringInputHandler;
};

export const convertPortToPortRangeService = (execute: () => void) => {
  return {
    handleSingleInput: (input: string) => {
      if (String(input).includes("-")) {
        execute();
      }
    },
  };
};
