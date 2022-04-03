import { EditableElement } from "../../types/types";
import { PopUpForm, PopUpFormProps } from "./PopUpForm";
import {
  CheckIcon,
  Name,
  Comment,
  TrashIcon,
  Type,
  Label,
  defaultClass,
} from "./ServiceCreationForm";

export interface NetworkObjectPopupProps extends PopUpFormProps {
  isVisible: boolean;
  name: string;
  element: EditableElement;
  setName: (string) => void;
  comment: string;
  setComment: (string) => void;
  ip: string;
  setIp: (string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export function NetworkObjectPopup({
  object,
}: {
  object: NetworkObjectPopupProps;
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
          <Type />
          <Name value={object.name} onChange={(name) => object.setName(name)} />
          <IpAddress value={object.ip} onChange={(ip) => object.setIp(ip)} />
          <Comment
            value={object.comment}
            onChange={(comment) => object.setComment(comment)}
          />
        </div>
        <div className="flex justify-self-end items-center flex-row justify-between space-x-4">
          <CheckIcon onClick={object.onSubmit} />
          {object.onDelete ? <TrashIcon onClick={object.onDelete} /> : <></>}
        </div>
      </form>
    </PopUpForm>
  );
}

export const IpAddress = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <Label value="IP Address" />
    <input
      type="ip"
      name="ip"
      id="ip"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="192.168.1.123"
      className={defaultClass}
      required
    />
  </div>
);

export default NetworkObjectPopup;
