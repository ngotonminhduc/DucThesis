import { AlertCircle, CheckCircle2, EyeOff, XCircle } from "lucide-react";
import React from "react";

interface ResultIconProps {
  isCorrect: boolean;
  isEssay?: boolean
}
const ResultIcon: React.FC<ResultIconProps> = ({ isCorrect, isEssay }) => {
  return (
    <div className="ml-4">
      {isCorrect ? (
        <CheckCircle2 className="w-6 h-6 text-green-500" />
      ) : isEssay ? <AlertCircle className="w-6 text-yellow-500" /> : (
        <XCircle className="w-6 h-6 text-red-500" />
      )}
    </div>
  );
};

export default ResultIcon;
