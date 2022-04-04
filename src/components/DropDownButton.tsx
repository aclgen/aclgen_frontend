import { CheckIcon } from "./creationForm/ServiceCreationForm";

export function DropDownButton({
  isDropped,
  onClick,
  title,
}: {
  isDropped: boolean;
  onClick: (clicked: boolean) => void;
  title: string;
}) {
  return (
    <div
      onClick={() => onClick(!isDropped)}
      className="transition-shadow hover:shadow-lg px-4 group  h-10 hover:cursor-pointer border-gray-200 rounded-md border shadow-md hover:bg-slate-100  font-light text-gray-700 py-2"
    >
      <span className="flex items-center">
        <svg
          className={`fill-current h-4 w-4 ${
            isDropped ? "rotate-180" : "rotate-90"
          }
        transition duration-300 ease-in-out`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
        <h3 className="text-md px-2 select-none">{title}</h3>
      </span>
    </div>
  );
}
