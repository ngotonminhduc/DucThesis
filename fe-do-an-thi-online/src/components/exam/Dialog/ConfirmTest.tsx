import React from "react";
import { ClipboardPen, AlertCircle, Clock } from "lucide-react";

const styleByStatus = {
  pending: "text-amber-600 dark:text-amber-500",
  active: "text-emerald-600 dark:text-emerald-500",
};

export interface ConfirmTestProps {
  title: string;
  message: string;
  onConfirm?: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  status?: "pending" | "active";
}

const ConfirmTest: React.FC<ConfirmTestProps> = ({
  title,
  message,
  onClose,
  onConfirm,
  status = "active",
  cancelText = "Cancel",
  confirmText = "Start Exam",
}) => {
  return (
    <div className="text-center">
      {/* Main Icon */}
      <div className="mx-auto mb-4 flex justify-center">
        <ClipboardPen
          className={`h-16 w-16 ${styleByStatus[status]}`}
          strokeWidth={1.5}
        />
      </div>

      {/* Time Warning */}
      {onConfirm && (
        <div className="mb-3 flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <Clock className="h-5 w-5" />
          <span>Thời gian sẽ bắt đầu đếm sau khi xác nhận</span>
        </div>
      )}

      {/* Content */}
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-300">{message}</p>

      {/* Warning Message */}
      {onConfirm && (
        <div className="mx-auto mb-6 max-w-xs rounded-lg bg-amber-50 p-3 text-left text-sm text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Hãy chắc chắn rằng bạn đã sẵn sàng trước khi bắt đầu</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onClose}
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
        >
          {cancelText || "Cancel"}
        </button>
        {onConfirm && (
          <button
            onClick={onConfirm}
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmTest;
