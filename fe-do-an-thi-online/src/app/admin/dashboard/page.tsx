"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { BottomRightButton } from "@/components/button/BottomRightButton";
import { CardHome } from "@/components/card/CardHome";
import { toast } from "react-toastify";
import { useExamStore } from "@/store/exam-store";
import { TExam } from "@/services/examService";
import { useModal } from "@/hooks/useModal";
import ConfirmDeleteExam from "@/components/exam/Dialog/ConfirmDeleteExam";
import { Alert } from "@/components/common/Alert";
import EmptyExamState from "@/components/exam/EmtyExamState";

export default function AdminDashboard({data}: any) {
  const router = useRouter();
  const [exams, setExams] = useState<TExam[]>([]);
  const { exams: storedExams, deleteExam, getExams, error, clearError } = useExamStore();
  const { openModal } = useModal();

  useEffect(() => {
    (async () => {
      await getExams();
    })();
  }, []);

  useEffect(() => {
    const d = [] as TExam[];
    storedExams.forEach((e) => {
      d.push(e);
    });
    setExams(d);
  }, [storedExams.size]);

  useEffect(() => {
    if(!error){
      return
    }
    toast.error(error);
    clearError();
  }, [error]);

  const handleRedirectExamDetail = (examId: string) => {
    router.push(`/admin/exam/${examId}`);
  };

  const handleRemoveExam = async (examId: string) => {
    await deleteExam(examId);
    openModal(Alert, {
      type: "success",
      title: "Đã xóa",
      message: "Bài thi đã được xóa thành công!",
    });
  };

  const handleOpenConfirmDeleteDialog = useCallback(
    (examId: string) => {
      openModal(
        ConfirmDeleteExam,
        {
          title: "Xác nhận xóa bài thi",
          message:
            "Bạn có chắc chắn muốn xóa bài thi này không? Hành động này không thể hoàn tác.",
          onConfirm: () => handleRemoveExam(examId),
          confirmText: "Xóa",
          cancelText: "Hủy bỏ",
        },
        { size: "sm" }
      );
    },
    [exams]
  );
  return (
    <div className="flex flex-col items-center h-screen pt-[70px] overflow-y-auto ">
      <Header />
      {exams.length ? (
        <div className="flex z-0 flex-col w-full items-center mt-4 flex-1 ">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg lg:w-9/12 pb-3 overflow-x-hidden ">
            {/* flex-grow */}
            {exams.map((e, index) => (
              <CardHome
                examId={e.id}
                onClick={() => handleRedirectExamDetail(e.id)}
                key={index}
                examTime={e ? e.examTime : 0}
                topic={e ? e.topic : ""}
                status={e ? e.status : "inactive"}
                description={e ? e.description : ""}
                onRemoveItem={() => handleOpenConfirmDeleteDialog(e.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyExamState onCreateExam={() => router.push("/admin/exam")} />
      )}
      {exams.length ? (
        <BottomRightButton onClick={() => router.push("/admin/exam")} />
      ) : (
        <></>
      )}
    </div>
  );
}
