import {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  Ref,
} from "react";

interface TextInputProps {
  placeholder?: string;
  customStyle?: string;
  disable?: boolean;
  val?: string;
  style?: HTMLAttributes<HTMLInputElement>["className"];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
  ref?: Ref<HTMLInputElement>;
}
export const TextInput = ({
  placeholder,
  customStyle,
  style,
  disable,
  val,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  ref,
}: TextInputProps) => {
  return (
    <input
      ref={ref}
      type="text"
      onBlur={onBlur}
      placeholder={placeholder}
      className={
        style ??
        `w-full ml-3 p-1 bg-transparent rounded-md focus:border-b-2 
      focus:border-gray-300 focus:outline-none focus:ring-0
      ${disable ? "bg-gray-700 cursor-not-allowed" : ""} ${customStyle}`
      }
      value={val}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      disabled={disable}
    />
  );
};
