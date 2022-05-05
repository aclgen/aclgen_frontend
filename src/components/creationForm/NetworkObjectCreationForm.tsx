import { PopUpForm } from "./PopUpForm";
import {
  CheckIcon,
  Comment,
  inputStyle,
  Label,
  Name,
  TrashIcon,
} from "./ServiceCreationForm";
import {
  IPV4PopUpProps,
  IPV4RangePopUpProps,
  NetworkObjectPopUpProps,
} from "../../features/networkObject/ObjectCreationPopup";

import { NetworkObjectElement, NetworkObjectType } from "../../types/types";
import { StringInputHandler } from "../../features/input/baseInput";
import { If } from "../If";

export function NetworkObjectPopup({
  object,
}: {
  object: NetworkObjectPopUpProps;
}) {
  return (
    <PopUpForm popUp={object}>
      <form
        className="space-y-3 py-1  px-6 flex flex-row justify-between space-x-4"
        action="#"
      >
        <div className="flex justify-self-start items-center flex-row justify-between space-x-4 ">
          <img
            className="h-8 mt-5"
            src={"/computer-networks.svg"}
            alt={"Network Object"}
          />
          <ObjectTypeInput value={object.type} onChange={object.setType} />
          <Name
            value={object.name}
            onChange={(name) => object.setName(name)}
            isFocus={isFocused(object) === INPUT_ELEMENTS.NAME}
          />
          <ObjectTypesInputs object={object} />
          <Comment
            value={object.comment}
            onChange={(comment) => object.setComment(comment)}
            isFocus={false}
          />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon
            onClick={object.onSubmit}
            disabled={isInputError(object)}
          />
          <If condition={object.onDelete !== undefined}>
            <TrashIcon onClick={object.onDelete} />
          </If>
        </div>
      </form>
    </PopUpForm>
  );
}

enum INPUT_ELEMENTS {
  NAME,
  IP,
}
export const ObjectTypeInput = ({
  value,
  onChange,
}: {
  value: NetworkObjectType;
  onChange: (type: NetworkObjectType) => void;
}) => (
  <div>
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      Type
    </label>
    <select
      name="port"
      id="port"
      placeholder="Port"
      className="bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
      value={value}
      onChange={(event) => onChange(NetworkObjectType[event.target.value])}
    >
      {Object.values(NetworkObjectType).map((value) => (
        <option aria-selected="true" key={value} value={value}>
          {NetworkObjectType[value]}
        </option>
      ))}
    </select>
  </div>
);

export function ObjectTypesInputs({
  object,
}: {
  object: NetworkObjectPopUpProps;
}) {
  if (object.type == NetworkObjectType.IPV4) {
    return (
      <IPV4Input
        name={"Ip address"}
        isFocus={isFocused(object) == INPUT_ELEMENTS.IP}
        inputHandler={(object as IPV4PopUpProps).InputHandler}
      />
    );
  } else if (object.type == NetworkObjectType.IPV4_RANGE) {
    return <IPV4RangeInputs object={object as IPV4RangePopUpProps} />;
  }
}

export const IPV4Input = ({
  inputHandler,
  name,
  isFocus = false,
}: {
  inputHandler: StringInputHandler;
  isFocus: boolean;
  name: string;
}) => (
  <div>
    <Label value={name} />
    <input
      type="text"
      name="IP"
      id="IP"
      autoFocus={isFocus}
      onChange={(event) => inputHandler.setInputValue(event.target.value)}
      value={inputHandler.inputValue}
      placeholder="80"
      className={inputStyle(inputHandler.isError)}
      required
    />
    <If condition={inputHandler.isError}>
      <p>{inputHandler.error}</p>
    </If>
  </div>
);

export function IPV4RangeInputs({ object }: { object: IPV4RangePopUpProps }) {
  return (
    <>
      <IPV4Input
        isFocus={isFocused(object) == INPUT_ELEMENTS.IP}
        name={"From"}
        inputHandler={object.RangeInputHandler.ipFromInputHandler}
      />
      <IPV4Input
        isFocus={false}
        name={"To"}
        inputHandler={object.RangeInputHandler.ipToInputHandler}
      />
    </>
  );
}

function isFocused(object: NetworkObjectElement): INPUT_ELEMENTS {
  if (object.name == "") {
    return INPUT_ELEMENTS.NAME;
  }

  return INPUT_ELEMENTS.IP;
}

export const Type = () => (
  <div>
    <Label value="TYPE" />
    <h2
      className={
        "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none"
      }
    >
      Object
    </h2>
  </div>
);

function isInputError(object: NetworkObjectPopUpProps): boolean {
  switch (object.type) {
    case NetworkObjectType.IPV4:
      return isPortInputError(object as IPV4PopUpProps);
    case NetworkObjectType.IPV4_RANGE:
      return isPortRangeInputError(object as IPV4RangePopUpProps);
  }
}

function isPortInputError(object: IPV4PopUpProps): boolean {
  if (object.InputHandler.isError) {
    return true;
  } else if (object.InputHandler.isError) {
    return true;
  }
}

function isPortRangeInputError(object: IPV4RangePopUpProps): boolean {
  if (object.RangeInputHandler.ipFromInputHandler.isError) {
    return true;
  } else if (object.RangeInputHandler.ipToInputHandler.isError) {
    return true;
  }
}

export default NetworkObjectPopup;
