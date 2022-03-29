/**
 *
 * @param key index of the Rule
 * @returns A properly formatted Rule card
 */
function card(key: number) {
  return (
    <div
      key={key}
      className="p-2 pl-4 bg-white container-xl transition-shadow  hover:cursor-pointer active:border-cyan-800 hover:border-cyan-600 hover:shadow-lg rounded-md border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
    >
      <form
        className="space-y-2 space-x-12 flex flex-row justify-between space-x-4"
        action="#"
      >
        <div className="space-y-2 flex justify-self-start flex-row justify-between space-x-4 ">
          <Index value={key} />
          <Name value={""} />
          <Source value="" />
          <Destination value="" />
          <Service value="" />
          <Direction value="" />
          <Policy value="" />
          <Comment value="" />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon />
          <LockIcon />
          <BoxIcon />
          <DragIcon />
        </div>
      </form>
    </div>
  );
}

const defaultClass: string =
  "bg-gray-50 border border-gray-300 w-32 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white";

const Index: React.FC<{ value: number }> = ({ value }) => (
  <p className="block pt-11 mb-2 text-sm font-light text-gray-400 dark:text-white">
    {`#${value}`}
  </p>
);

const BoxIcon = () => {
  return (
    <div>
      <img src="/square.svg" className=" mr-3 h-6" />
    </div>
  );
};

const DragIcon = () => {
  return (
    <div>
      <img src="/hamburger_menu.svg" className=" mr-3 h-6" />
    </div>
  );
};

const LockIcon = () => {
  return (
    <div>
      <img src="/locked.svg" className=" mr-3 h-6" />
    </div>
  );
};

const CheckIcon = () => {
  return (
    <div>
      <img src="/tick.svg" className=" mr-3 h-6" />
    </div>
  );
};

const Name = ({ value }: { value: string }) => (
  <div>
    <Label value="Name" />
    <input
      type="email"
      name="email"
      id="email"
      className={defaultClass}
      placeholder="Rule name..."
      required
    />
  </div>
);

const Source = ({ value }: { value: string }) => (
  <div className="mt-2">
    <Label value="SOURCE" />
    <input
      type="source"
      name="source"
      id="source"
      placeholder="192.168.x.x"
      className={defaultClass}
      required
    />
  </div>
);

const Destination = ({ value }: { value: string }) => (
  <div>
    <Label value="DESTINATION" />
    <input
      type="destination"
      name="service"
      id="service"
      placeholder="HTTP/80"
      className={defaultClass}
      required
    />
  </div>
);

const Service = ({ value }: { value: string }) => (
  <div>
    <Label value="SERVICE" />
    <input
      type="service"
      name="service"
      id="service"
      placeholder="HTTP/80"
      className={defaultClass}
      required
    />
  </div>
);

const Direction = ({ value }: { value: string }) => (
  <div>
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      DIRECTION
    </label>
    <select
      name="direction"
      id="direction"
      placeholder="incoming"
      className="bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
    >
      <option value="incoming">INCOMING</option>
      <option value="outgoing">OUTGOING</option>
    </select>
  </div>
);

const Policy = ({ value }: { value: string }) => (
  <div>
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      POLICY
    </label>
    <select
      name="policy"
      id="policy"
      placeholder="DENY"
      className="bg-gray-50 border max-w-sm  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
    >
      <option value="allow">ALLOW</option>
      <option value="deny">DENY</option>
    </select>
  </div>
);

const Comment = ({ value }: { value: string }) => (
  <div className="max-w-fit">
    <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
      Comment
    </label>
    <textarea
      name="comment"
      id="comment"
      placeholder="..."
      className="bg-gray-50 border resize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      required
    />
  </div>
);

const Label = ({ value }: { value: string }) => (
  <label className="block mb-2 text-sm font-light text-gray-500 dark:text-gray-300">
    {value}
  </label>
);

export default card;
