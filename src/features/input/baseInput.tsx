import { useState } from "react";
import { validatePortNumber } from "../service/ServiceInputHandler";

export function useStringInputHandler(
  initialValue: string,
  validator: (input: any) => InputValidationResult,
  specialInputHandler?: specialInputConditions
): StringInputHandler {
  const [inputValue, setValue] = useState(initialValue);
  const errorHandler = useErrorInputHandler();

  const setInputValue = useInputTypeValidator(
    validator,
    setValue,
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

export function useInputTypeValidator(
  validator: (input: any) => InputValidationResult,
  onInputSuccess: (input: any) => void,
  errorHandler: ErrorInputHandler,
  specialInputHandler?: specialInputConditions
) {
  return function setInputValue(input: string): void {
    specialInputHandler?.handleSingleInput(input);

    const validatorResult = validator(input);
    if (validatorResult.isValid) {
      errorHandler.clearErrorMessage();
    } else {
      errorHandler.setErrorMessage(validatorResult.message);
    }

    onInputSuccess(input);
  };
}

export function useErrorInputHandler(): ErrorInputHandler {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  function setErrorMessage(message: string) {
    setError(message);
    setIsError(true);
  }

  function clearErrorMessage() {
    setErrorMessage("");
    setIsError(false);
  }
  return { isError, error, setErrorMessage, clearErrorMessage };
}

export function createMessage(
  isValid: boolean,
  message: string = ""
): InputValidationResult {
  return { isValid: isValid, message: message };
}

export type StringInputHandler = {
  isError: boolean;
  error: string;
  inputValue: string;
  setInputValue: (newInput: string) => void;
};

export type InputValidationResult = {
  isValid: boolean;
  message: string;
};

export type ErrorInputHandler = {
  isError: boolean;
  error: string;
  setErrorMessage: (input: string) => void;
  clearErrorMessage: () => void;
};

export interface specialInputConditions {
  handleSingleInput?: (input: string) => void;
  handleDualInput?: (input1: string, input2: string) => void;
}
