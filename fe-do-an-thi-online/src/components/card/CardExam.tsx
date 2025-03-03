'use client';

import { ReactNode } from 'react';

interface CardExamProps {
  children?: ReactNode;
  className?: string
}

export const CardExam = ({ children, className }: CardExamProps) => {
  return (
    <div className={`border border-gray-300 rounded-lg p-4 shadow-md ${className}`}>
      {children}
    </div>
  );
};
