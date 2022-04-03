export const CountableCheckButton = ({
  onClick,
  number,
}: {
  onClick: () => void;
  number: number;
}) => {
  return (
    <div
      onClick={onClick}
      className="border-2 relative border-white rounded-md hover:cursor-pointer hover:border-blue-400 h-8 w-8 hover:shadow-lg"
    >
      <div
        className={`absolute right-0 top-0 translate-x-2 text-sm text-blue-700 -translate-y-2`}
      >
        {number > 0 ? number : ""}
      </div>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 512 512"
        className={`h-6 pt-1 pl-1`}
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

export default CountableCheckButton;