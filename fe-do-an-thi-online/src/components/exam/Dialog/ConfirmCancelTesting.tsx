import React from "react";
import { XCircle, AlertCircle } from "lucide-react";

interface CancelTestProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmCancelTesting: React.FC<CancelTestProps> = ({
  title,
  message,
  onClose,
  onConfirm,
  cancelText = "Quay lại",
  confirmText = "Xác nhận hủy",
}) => {
  return (
    <div className="text-center">
      {/* Main Icon */}
      <div className="mx-auto mb-4 flex justify-center">
        <XCircle
          className="h-16 w-16 text-red-600 dark:text-red-500"
          strokeWidth={1.5}
        />
      </div>

      {/* Content */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>

      {/* Warning Message */}
      <div className="mx-auto mb-6 max-w-xs rounded-lg bg-red-50 p-3 text-left text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Hành động này không thể hoàn tác. Hãy chắc chắn trước khi rời.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onClose}
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmCancelTesting;
