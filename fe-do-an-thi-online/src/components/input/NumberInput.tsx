import {
  ChangeEventHandler,
  FocusEventHandler,
  HTMLAttributes,
  KeyboardEventHandler,
  Ref,
} from "react";

interface NumberInputProps {
  placeholder?: string;
  customStyle?: string;
  disable?: boolean;
  val?: string | number;
  style?: HTMLAttributes<HTMLInputElement>["className"];
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  ref?: Ref<HTMLInputElement>;
  min?: number;
  max?: number;
  step?: number | string;
}

export const NumberInput = ({
  placeholder,
  customStyle,
  style,
  disable,
  val,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyPress,
  ref,
  min,
  max,
  step = "any",
}: NumberInputProps) => {
  return (
    <input
      ref={ref}
      type="number"
      min={min}
      max={max}
      step={step}
      onBlur={onBlur}
      placeholder={placeholder}
      className={
        style ??
        `w-full ml-3 p-1 bg-transparent rounded-md focus:border-b-2 
        focus:border-gray-300 focus:outline-none focus:ring-0
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
        [&::-webkit-inner-spin-button]:appearance-none
        ${disable ? "bg-gray-700 cursor-not-allowed" : ""} ${customStyle}`
      }
      value={val}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      disabled={disable}
    />
  );
};