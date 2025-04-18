import { ChangeEventHandler, useEffect } from "react";

interface RadioProps {
  checked: boolean;
  disabled?: boolean;
  customStyle?: string;
  val?:  string | readonly string[] | number | undefined
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
export const Radio = ({
  checked,
  onChange,
  customStyle,
  val,
  disabled = false,
}: RadioProps) => {
  return (
    <input
      type="radio"
      className={`w-5 h-5 ml-3 ${customStyle}`}
      checked={checked}
      value={val}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
