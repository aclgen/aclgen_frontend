import { useState } from "react";
import {
  createMessage,
  InputValidationResult,
  StringInputHandler,
  useErrorInputHandler,
  useInputTypeValidator,
  useStringInputHandler,
} from "../input/baseInput";

export function usePortInputHandler(
  initialPort: string,
  specialInputHandler?: specialInputConditions
): StringInputHandler {
  return useStringInputHandler(
    initialPort,
    validatePortNumber,
    specialInputHandler
  );
}

export function useProtocolInputHandler(
  initialProtocol: string,
  specialInputHandler?: specialInputConditions
): StringInputHandler {
  const [inputValue, setProtocolValue] = useState(initialProtocol);
  const errorHandler = useErrorInputHandler();

  const setInputValue = useInputTypeValidator(
    validateProtocolInput,
    setProtocolValue,
    errorHandler,
    specialInputHandler
  );

  return {
    isError: errorHandler.isError,
    error: errorHandler.error,
    inputValue,
    setInputValue,
  };
}

export function usePortRangeInputHandler(
  portFrom: string = "",
  portTo: string = "",
  specialInputHandler?: specialInputConditions
): PortRangeInputHandler {
  const portFromInputHandler = usePortInputHandler(
    portFrom,
    specialInputHandler
  );

  const portToInputHandler = usePortInputHandler(portTo, specialInputHandler);

  function setInputValue(
    input1: string,
    input2: string,
    inputHandler: (input: string) => void
  ): void {
    specialInputHandler?.handleDualInput(input1, input2);

    inputHandler(input1);
  }

  return {
    portFromHandler: {
      ...portFromInputHandler,
      setInputValue: (input) =>
        setInputValue(
          input,
          portToInputHandler.inputValue,
          portFromInputHandler.setInputValue
        ),
    },
    portToHandler: {
      ...portToInputHandler,
      setInputValue: (input) =>
        setInputValue(
          input,
          portFromInputHandler.inputValue,
          portToInputHandler.setInputValue
        ),
    },
  };
}

export function validatePortNumber(input: string): InputValidationResult {
  const inputNumber = Number.parseInt(input);
  if (isNaN(inputNumber) || isNaN(+input)) {
    if (input.toUpperCase() === "ANY") {
      return createMessage(true);
    }
    return createMessage(false, "input is not a number");
  } else if (inputNumber < 0) {
    return createMessage(false, "port cannot be below 0");
  } else if (inputNumber > 65535) {
    return createMessage(false, "port cannot be above 65,535");
  } else {
    return createMessage(true);
  }
}

function validateProtocolInput(inputValue: string) {
  switch (inputValue.toUpperCase()) {
    case "TCP":
      return createMessage(true);
    case "UDP":
      return createMessage(true);
    case "SCTP":
      return createMessage(true);
    case "DCCP":
      return createMessage(true);
    case "BOTH":
      return createMessage(true);
    case "ANY":
      return createMessage(true);
    case "ICMP":
      return createMessage(true);
    default:
      return createMessage(false, "not a valid protocol");
  }
}

export type PortRangeInputHandler = {
  portFromHandler: StringInputHandler;
  portToHandler: StringInputHandler;
};

export interface specialInputConditions {
  handleSingleInput?: (input: string) => void;
  handleDualInput?: (input1: string, input2: string) => void;
}

export const convertPortToPortRangeService = (execute: () => void) => {
  return {
    handleSingleInput: (input: string) => {
      if (String(input).includes("-")) {
        execute();
      }
    },
  };
};
