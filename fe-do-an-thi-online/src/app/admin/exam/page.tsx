"use client";

import { CardExam } from "@/components/card/CardExam";
import { ExamHeader } from "@/components/exam/ExamHeader/ExamHeader";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/button/Button";
import { useRouter } from "next/navigation";
import Spinner from "@/components/effect/Spinner";
import { useExamStore } from "@/store/exam-store";
import { toast } from "react-toastify";
import { TExam } from "@/services/examService";

export default function CreateExamPage() {
  const [canNext, setCanNext] = useState<Boolean>(false);
  const router = useRouter();
  const [exam, setExam] = useState<TExam>();
  const { error, createExam, isLoading, clearError } = useExamStore();
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleUpdateExamData = useCallback(
    (data: TExam) => {
      setExam(data);
      setCanNext(
        !!data.topic.trim() && !!data.description.trim() && data.examTime > 0
      );
    },
    [exam]
  );

  useEffect(() => {
    if(selectedSubjectId && exam){
      setExam({
        ...exam,
        subjectId: selectedSubjectId,
      })
    }
  }, [selectedSubjectId])

  const handleContinue = async () => {
    if (!canNext || !exam) {
      return;
    }
    console.log(exam);

    const d = await createExam(exam);
    if (!d) {
      return;
    }
    router.push(`/admin/exam/${d.id}`);
  };

  const handleSubjectSelect = (subjectId: string) => {
    if (!exam) {
      return;
    }
    setSelectedSubjectId(subjectId)
  };

  return (
    <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center ">
      <ExamHeader
        onUpdateItem={handleUpdateExamData}
        disabledStatus={true}
        onSubjectSelect={handleSubjectSelect}
        selectedSubjectId={selectedSubjectId}
      />
      {!isLoading ? (
        <Button
          onClick={handleContinue}
          text="Tiếp tục"
          customStyle={`w-full cursor-${
            canNext ? "pointer" : "not-allowed"
          } mt-2 flex justify-center text-gray-50 align-middle  rounded-sm ${
            canNext ? "bg-blue-500" : "bg-gray-500"
          } p-2`}
        />
      ) : (
        <div className="w-full mt-2 flex justify-center text-gray-50 align-middle rounded-s p-2">
          <Spinner />
        </div>
      )}
    </CardExam>
  );
}
