import { forwardRef, useEffect, useState } from "react";
import { Eye, X } from "lucide-react";
import { ItemAnswer } from "@/utils/type";

export type InputProps = {
  name: string;
  nameRadio: string;
  containerStyle?: string;
  placeholder?: string;
  onChangeText?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: (v: string) => void;
  defaultText?: string;
  style?: string;
  disable: boolean;
  reminder?: boolean;
  isChecked?: boolean;
  onRadioChange?: () => void;
  onRemoveItem?: () => void;
};

export const InputForm = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      nameRadio,
      containerStyle = '',
      placeholder = 'Search ...',
      onChangeText,
      onFocus,
      onBlur,
      defaultText = '',
      disable,
      style,
      reminder,
      isChecked,
      onRadioChange,
      onRemoveItem,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(defaultText);
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
      setInputValue(defaultText);
    }, [defaultText]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      onChangeText?.(value);
    };

    return (
      <div className={`flex items-center flex-1 ${containerStyle}`}>
        {/* Radio button */}
        <input
          type="radio"
          className="w-5 h-5 ml-3"
          checked={isChecked}
          onChange={onRadioChange}
          disabled={disable}
        />
        
        {/* Input text */}
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full ml-3 p-1 bg-transparent rounded-md focus:border-b-2 
            focus:border-gray-300 focus:outline-none focus:ring-0
            ${disable ? 'bg-gray-700 cursor-not-allowed' : ''} ${style}`}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(true)
          }}
          disabled={disable}
          ref={ref}
        />
        {
          isFocused && 
          <button type="button" className="ml-3" onClick={onRemoveItem}>
            <X className="w-8 h-8"/>
          </button>
        }
      </div>
    );
  }
);
