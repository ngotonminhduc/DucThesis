import React from "react";

interface ConfirmDeleteExamProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDeleteExam: React.FC<ConfirmDeleteExamProps> = ({
  message,
  onClose,
  onConfirm,
  title,
  cancelText,
  confirmText,
}) => {
  return (
    <div className="text-center">
      {/* Warning Icon */}
      <svg
        className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>

      {/* Confirmation Text */}
      <p className="mb-4 text-gray-500 dark:text-gray-300">{title}</p>

      {/* Action Buttons */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={onClose}
          type="button"
          className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          type="button"
          className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteExam;
