"use client";

import { useEffect } from "react";
import { useSubjectStore } from "@/store/subject-store";
import Dropdown from "@/components/userDropdown/Dropdown";

export const SubjectSelector = ({
  onSubjectSelect,
  selectedSubjectId,
}: {
  onSubjectSelect: (subjectId: string) => void;
  selectedSubjectId?: string;
}) => {
  const { subjects, getSubjects, isLoading, error } = useSubjectStore();

  useEffect(() => {
    getSubjects();
  }, []);

  const subjectOptions = Array.from(subjects.values()).map((subject) => ({
    value: subject.id,
    label: subject.title,
  }));

  return (
    <div className="mb-6">
      <Dropdown
        label="Chọn ngân hàng đề"
        item={subjectOptions}
        placeHolder="Chọn môn học"
        onValueChange={onSubjectSelect}
        defaultValue={selectedSubjectId}
        disabled={isLoading}
      />
    </div>
  );
};
