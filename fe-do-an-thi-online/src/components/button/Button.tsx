import React, { CSSProperties, MouseEventHandler, ReactNode } from "react";
import ButtonSpinner from "../effect/ButtonSpinner";

interface ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  customStyle?: string;
  icon?: ReactNode;
  text: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button = ({
  onClick,
  style,
  customStyle,
  text,
  icon,
  disabled,
  className,
  loading = false, // Mặc định là false
}: ButtonProps) => {
  return (
    <button
      className={
        className ??
        `inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${customStyle}`
      }
      style={style}
      onClick={onClick}
      disabled={disabled || loading} // Vô hiệu hoá button khi đang loading
      type="button"
    >
      {loading ? (
        <>
          <ButtonSpinner />
          <span className="whitespace-nowrap">Đang xử lý...</span>
        </>
      ) : (
        <>
          {icon && icon}
          <span className="whitespace-nowrap">{text}</span>
        </>
      )}
    </button>
  );
};
