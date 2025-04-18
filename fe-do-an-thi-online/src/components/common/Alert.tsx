import React from "react";

interface AlertProps {
  title?: string;
  message: string;
  onClose: () => void;
  type?: "success" | "error" | "info" | "warning";
}

export const Alert: React.FC<AlertProps> = ({
  title,
  message,
  onClose,
  type = "info",
}) => {
  // Map type to color classes
  const iconColors = {
    success: "text-green-500 bg-green-100",
    error: "text-red-500 bg-red-100",
    info: "text-blue-500 bg-blue-100",
    warning: "text-yellow-500 bg-yellow-100",
  };

  // Map type to icon
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "info":
      default:
        return (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="text-center">
      <div
        className={`mx-auto ${iconColors[type]} p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4`}
      >
        {getIcon()}
      </div>

      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      <p className="mb-6 text-gray-600">{message}</p>

      <button
        onClick={onClose}
        className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
      >
        Đóng
      </button>
    </div>
  );
};
