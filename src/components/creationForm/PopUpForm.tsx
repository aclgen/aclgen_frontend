import { EditableElement } from "../../types/types";

export interface PopUpFormProps {
  isVisible: boolean;
  element: EditableElement;
  onSubmit?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function PopUpForm({
  popUp,
  children,
}: {
  popUp: PopUpFormProps;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${
        popUp.isVisible ? "scale-100 h-fit" : "scale-y-0 h-0"
      } absolute inset-x-0 bottom-2 transform origin-bottom  duration-300 transition`}
    >
      <div
        className={`mx-auto h-24 container relative bg-slate-100 shadow-lg rounded-md border-2 ${
          popUp.element.status === "new"
            ? "border-green-400"
            : "border-blue-400"
        }  flex-row items-center`}
      >
        {children}
        <div className="absolute right-2 top-1">
          <XIcon onClick={popUp.onCancel} size="sm" />
        </div>
      </div>
    </div>
  );
}

export type Size = "sm" | "md" | "lg";

export const XIcon = ({
  onClick,
  size,
}: {
  onClick: (event?) => void;
  size: Size;
}) => {
  const height = getHeight(size);
  return (
    <div
      onClick={onClick}
      className="group hover:cursor-pointer rounded-full hover:bg-gray-200 hover:shadow-md"
    >
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 329.26933 329"
        className={`h-${height} p-1`}
      >
        <path
          className="fill-gray-500"
          d="m194.800781 164.769531 128.210938-128.214843c8.34375-8.339844 8.34375-21.824219 0-30.164063-8.339844-8.339844-21.824219-8.339844-30.164063 0l-128.214844 128.214844-128.210937-128.214844c-8.34375-8.339844-21.824219-8.339844-30.164063 0-8.34375 8.339844-8.34375 21.824219 0 30.164063l128.210938 128.214843-128.210938 128.214844c-8.34375 8.339844-8.34375 21.824219 0 30.164063 4.15625 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921875-2.089844 15.082031-6.25l128.210937-128.214844 128.214844 128.214844c4.160156 4.160156 9.621094 6.25 15.082032 6.25 5.460937 0 10.921874-2.089844 15.082031-6.25 8.34375-8.339844 8.34375-21.824219 0-30.164063zm0 0"
        />
      </svg>
    </div>
  );
};
export function getHeight(size: Size) {
  switch (size) {
    case "sm": {
      return 4;
    }
    case "md": {
      return 6;
    }
    case "lg": {
      return 8;
    }
  }
}
