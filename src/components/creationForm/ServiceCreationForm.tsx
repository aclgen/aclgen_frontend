import {
  PortPopUpProps,
  PortRangePopUpProps,
  ServicePopUpProps,
} from "../../features/service/ServiceCreationPoopup";
import { ServiceElement, ServiceType } from "../../types/types";
import { If } from "../If";
import { PopUpForm } from "./PopUpForm";
import { StringInputHandler } from "../../features/input/baseInput";

export function ServicePopupForm({ service }: { service: ServicePopUpProps }) {
  return (
    <PopUpForm popUp={service}>
      <form
        className="space-y-3 py-1  px-6 flex flex-row justify-between space-x-4"
        action="#"
        autoComplete={"off"}
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="flex justify-self-start items-center flex-row justify-between space-x-4 ">
          <img
            className="h-8 mt-5"
            src={"/computer-networks.svg"}
            alt={"Service"}
          />
          <ServiceTypeInput value={service.type} onChange={service.setType} />
          <Name
            value={service.name}
            isFocus={isFocused(service) == INPUT_ELEMENTS.NAME}
            onChange={(name) => service.setName(name)}
          />
          <ServiceTypeInputs service={service} />
          <Comment
            value={service.comment}
            onChange={(comment) => service.setComment(comment)}
            isFocus={false}
          />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon
            onClick={() => service.onSubmit()}
            disabled={isInputError(service)}
          />
          <If condition={service.onDelete !== undefined}>
            <TrashIcon onClick={service.onDelete} />
          </If>
        </div>
      </form>
    </PopUpForm>
  );
}

enum INPUT_ELEMENTS {
  NAME,
  PORT,
  PROTOCOL,
}

function isFocused(service: ServiceElement): INPUT_ELEMENTS {
  if (service.name == "") {
    return INPUT_ELEMENTS.NAME;
  }

  return INPUT_ELEMENTS.PORT;
}

export function ServiceTypeInputs({ service }: { service: ServicePopUpProps }) {
  if (service.type == ServiceType.PORT_RANGE) {
    return <PortRangeInputs service={service as PortRangePopUpProps} />;
  } else if (service.type == ServiceType.PORT) {
    return <PortInputs service={service as PortPopUpProps} />;
  }
}

export function PortRangeInputs({ service }: { service: PortRangePopUpProps }) {
  return (
    <>
      <Port
        isFocus={isFocused(service) == INPUT_ELEMENTS.PORT}
        name={"Port Start"}
        inputHandler={service.portRangeInputHandler.portFromHandler}
      />
      <Port
        isFocus={false}
        name={"Port End"}
        inputHandler={service.portRangeInputHandler.portToHandler}
      />
      <Protocol isFocus={false} inputHandler={service.protocolInputHandler} />
    </>
  );
}

export function PortInputs({ service }: { service: PortPopUpProps }) {
  console.log(service);
  return (
    <>
      <Port
        isFocus={isFocused(service) == INPUT_ELEMENTS.PORT}
        name={"Port"}
        inputHandler={service.portInputHandler}
      />
      <Protocol isFocus={false} inputHandler={service.protocolInputHandler} />
    </>
  );
}

export const defaultClass: string =
  "bg-gray-50 border-2 border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none";

export const errorClass: string =
  "bg-gray-50 border-2 border-red-600 w-32 text-gray-900 text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block p-2.5 dark:bg-gray-600 dark:border-red-500 dark:placeholder-gray-400 dark:text-white outline-none";

export const Index: React.FC<{ value: number }> = ({ value }) => (
  <p className="block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white">
    {`#${value}`}
  </p>
);

export const TrashIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      className="h-10 group hover:cursor-pointer"
      onClick={onClick}
    >
      <path
        d="m337.185 149.911h-35.509v-18.911a10 10 0 0 0 -10-10h-71.352a10 10 0 0 0 -10 10v18.911h-35.509a26.881 26.881 0 0 0 -26.85 26.85v16.849a10 10 0 0 0 10 10h4.3v149.31a38.123 38.123 0 0 0 38.08 38.08h111.31a38.122 38.122 0 0 0 38.083-38.079v-149.312h4.3a10 10 0 0 0 10-10v-16.849a26.881 26.881 0 0 0 -26.849-26.849zm-106.861-8.911h51.352v8.913h-51.352zm-62.359 35.76a6.94 6.94 0 0 1 6.85-6.848h162.37a6.941 6.941 0 0 1 6.849 6.85v6.85h-176.069zm161.773 176.159a18.1 18.1 0 0 1 -18.083 18.081h-111.31a18.1 18.1 0 0 1 -18.083-18.08v-149.311h147.476zm-83.738-9.959v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 1 1 -20 0zm-41.869 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0zm83.738 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0z"
        className="fill-gray-800  group-hover:hidden"
      />
      <circle
        className="opacity-0 group-hover:fill-red-600 group-hover:opacity-100 transition-opacity duration-150"
        cx="256"
        cy="256"
        r="256"
        transform="matrix(.707 -.707 .707 .707 -106.039 256)"
      />
      <path
        d="m337.185 149.911h-35.509v-18.911a10 10 0 0 0 -10-10h-71.352a10 10 0 0 0 -10 10v18.911h-35.509a26.881 26.881 0 0 0 -26.85 26.85v16.849a10 10 0 0 0 10 10h4.3v149.31a38.123 38.123 0 0 0 38.08 38.08h111.31a38.122 38.122 0 0 0 38.083-38.079v-149.312h4.3a10 10 0 0 0 10-10v-16.849a26.881 26.881 0 0 0 -26.849-26.849zm-106.861-8.911h51.352v8.913h-51.352zm-62.359 35.76a6.94 6.94 0 0 1 6.85-6.848h162.37a6.941 6.941 0 0 1 6.849 6.85v6.85h-176.069zm161.773 176.159a18.1 18.1 0 0 1 -18.083 18.081h-111.31a18.1 18.1 0 0 1 -18.083-18.08v-149.311h147.476zm-83.738-9.959v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 1 1 -20 0zm-41.869 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0zm83.738 0v-111.311a10 10 0 0 1 20 0v111.311a10 10 0 0 1 -20 0z"
        fillRule="evenodd"
        className="opacity-0 fill-white group-hover:opacity-100 transition-opacity duration-150"
      />
    </svg>
  );
};

export const ServiceTypeInput = ({
  value,
  onChange,
}: {
  value: ServiceType;
  onChange: (type: ServiceType) => void;
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
      onChange={(event) => onChange(ServiceType[event.target.value])}
    >
      {Object.values(ServiceType).map((value) => (
        <option aria-selected="true" key={value} value={value}>
          {ServiceType[value]}
        </option>
      ))}
    </select>
  </div>
);

export const CheckIcon = ({
  onClick,
  disabled,
}: {
  disabled: boolean;
  onClick?: (event: any) => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onKeyPress={(e) => {
        e.key === "Enter" ? onClick(e) : {};
      }}
      className={`border-2 border-gray-100 rounded-md ${
        disabled
          ? " hover:cursor-not-allowed "
          : "hover:cursor-pointer hover:border-blue-400"
      }  h-10 w-10 hover:shadow-lg`}
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
          className={`${disabled ? " fill-gray-300 " : "fill-blue-700"}`}
        ></path>
      </svg>
    </button>
  );
};

export const Type = ({ name }: { name: string }) => (
  <div>
    <Label value="TYPE" />
    <h2
      className={
        "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none"
      }
    >
      {name}
    </h2>
  </div>
);

export const Name = ({
  value,
  onChange,
  isFocus = false,
}: {
  isFocus: boolean;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label value="Name" />
    <input
      type="name"
      name="Name"
      id="name"
      value={value}
      autoFocus={isFocus}
      onChange={(event) => onChange(event.target.value)}
      className={defaultClass}
      placeholder="Service name..."
      required
    />
  </div>
);

export const Port = ({
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
      name="port"
      id="port"
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

export const inputStyle = (isError: boolean) => {
  if (isError) {
    return errorClass;
  } else {
    return defaultClass;
  }
};

export const Protocol = ({
  isFocus = false,
  inputHandler,
}: {
  inputHandler: StringInputHandler;
  isFocus: boolean;
}) => (
  <div>
    <Label value="PROTOCOL" />
    <input
      type="protocol"
      name="protocol"
      id="protocol"
      autoFocus={isFocus}
      value={inputHandler.inputValue}
      onChange={(event) => inputHandler.setInputValue(event.target.value)}
      placeholder="TCP"
      className={inputStyle(inputHandler.isError)}
      required
    />
    <If condition={inputHandler.isError}>
      <p>{inputHandler.error}</p>
    </If>
  </div>
);

export const Comment = ({
  value,
  onChange,
  isFocus = false,
}: {
  isFocus: boolean;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="max-w-fit">
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      Comment
    </label>
    <textarea
      name="comment"
      id="comment"
      placeholder=""
      value={value}
      autoFocus={isFocus}
      onChange={(event) => onChange(event.target.value)}
      className="bg-gray-50 border border-gray-300 resize-x text-gray-900 text-sm rounded-lg outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
    />
  </div>
);

export const Label = ({ value }: { value: string }) => (
  <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
    {value}
  </label>
);

export default ServicePopupForm;
function isInputError(service: ServicePopUpProps): boolean {
  switch (service.type) {
    case ServiceType.PORT:
      return isPortInputError(service as PortPopUpProps);
    case ServiceType.PORT_RANGE:
      return isPortRangeInputError(service as PortRangePopUpProps);
  }
}

function isPortInputError(service: PortPopUpProps): boolean {
  if (service.portInputHandler.isError) {
    return true;
  } else if (service.protocolInputHandler.isError) {
    return true;
  }
}

function isPortRangeInputError(service: PortRangePopUpProps): boolean {
  if (service.portRangeInputHandler.portFromHandler.isError) {
    return true;
  } else if (service.portRangeInputHandler.portToHandler.isError) {
    return true;
  } else if (service.protocolInputHandler.isError) {
    return true;
  }
}
