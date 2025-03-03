import { Status } from "@/utils/type";
import React from "react";
import { Trash } from 'lucide-react';
import { formatTime } from "@/utils/formatTime";
interface CardProps {
  topic: string;
  examId: string;
  description: string;
  // status: "pending" | "completed" | "ongoing";
  status: Status;
  examTime: number;
  onClick?: () => void ;
  onRemoveItem?: () => void ;
}

const statusColors = {
  pending: "bg-yellow-500",
  // active: "bg-bl-500",
  active: "bg-blue-600",
  inactive: "bg-red-300",
};

export const CardHome: React.FC<CardProps> = ({
  topic,
  examId,
  description,
  status,
  examTime,
  onClick,
  onRemoveItem
}) => {
  const sliceTopic = topic.slice(0, 10) + (topic.length > 10 ? '...' : '')
  return (
    <div className="rounded-2xl shadow-lg w-full md:h-36 lg:h-40 border">
      <div onClick={onClick} className=" w-full h-28 max-w-md ">
        <div className="p-4 h-full rounded-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold line-clamp-1">{sliceTopic}</h2>
            <span className={`text-white text-sm px-3 py-1 rounded-full ${statusColors[status]}`}>
              {status}
            </span>
          </div>
          <p className="text-gray-600 mt-2 lg:h-16 line-clamp-2 ">{description}</p>
        </div>
      </div>
      <div className="flex justify-between items-end px-4">
        <div className="mt-1 w-1/2 text-gray-500 text-sm">Exam Time: {formatTime(examTime)}</div>
        <div className="flex justify-end items-end right-0 w-1/2">
          <button type="button" className="w-full flex justify-end right-0 " onClick={onRemoveItem}>
            <Trash className=" text-red-500 w-5"/>
          </button>
        </div>
      </div>
    </div>
  );
};

