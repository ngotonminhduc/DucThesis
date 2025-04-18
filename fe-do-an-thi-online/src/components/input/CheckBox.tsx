import { ChangeEventHandler, useEffect } from "react";

interface CheckBoxProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  val?: string;
  title?: string;
  customStyle?: string;
  checked?: boolean
}
export const CheckBox = ({
  val,
  onChange,
  title,
  checked,
  customStyle,
}: CheckBoxProps) => {
  return (
    <div>
      <label className="inline-flex items-center cursor-pointer mt-2">
        <input
          onChange={onChange}
          title={title}
          type="checkbox"
          value={val}
          checked={checked}
          className={customStyle ? customStyle : `w-10 h-6`}
        />
      </label>
    </div>
  );
};
