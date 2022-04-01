import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Service } from "../../types/types";

import { createNewService, selectService } from "./serviceSlice";

function ServiceCreationPopup() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectService);

  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [port, setPort] = useState(0);
  const [protocol, setProtocol] = useState("");

  return (
    <div
      className={`${
        state.newServiceStatus === "creating"
          ? "scale-100 h-fit"
          : "scale-y-0 h-0"
      } absolute inset-x-0 bottom-2 transform origin-bottom  duration-300 transition`}
    >
      <div className="mx-auto h-24 container bg-slate-100 shadow-lg rounded-md border-2 border-blue-400 flex-row items-center">
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
            <Name value={name} onChange={(name) => setName(name)} />
            <Port value={port} onChange={(port) => setPort(port)} />
            <Protocol
              value={protocol}
              onChange={(protocol) => setProtocol(protocol)}
            />
            <Comment
              value={comment}
              onChange={(comment) => setComment(comment)}
            />
          </div>
          <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
            <CheckIcon
              onClick={() => {
                const newService: Service = {
                  port: port,
                  protocol: protocol,
                  name: name,
                  id: "0",
                  comment: comment,
                };
                dispatch(createNewService(newService));
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
      Service
    </h2>
  </div>
);

export const Name = ({
  value,
  onChange,
}: {
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
      onChange={(event) => onChange(event.target.value)}
      className={defaultClass}
      placeholder="Service name..."
      required
    />
  </div>
);

export const Port = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => (
  <div>
    <Label value="PORT" />
    <input
      type="number"
      name="number"
      id="number"
      onChange={(event) => onChange(event.target.value as unknown as number)}
      value={value}
      placeholder="80"
      className={defaultClass}
      required
    />
  </div>
);

export const Protocol = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label value="PROTOCOL" />
    <input
      type="protocol"
      name="protocol"
      id="protocol"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="TCP"
      className={defaultClass}
      required
    />
  </div>
);

export const Comment = ({
  value,
  onChange,
}: {
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

export default ServiceCreationPopup;
