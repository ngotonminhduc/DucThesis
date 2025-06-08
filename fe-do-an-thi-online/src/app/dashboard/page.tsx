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
import EmptyExamState from "@/components/exam/EmtyExamState";
import ConfirmTest, {
  ConfirmTestProps,
} from "@/components/exam/Dialog/ConfirmTest";
import { useTestStore } from "@/store/test-store";
import { ModalOptions } from "@/components/modal/type";
import { useTagStore } from "@/store/tag-store";

type TTestMap = {
  [examId: string]: string[];
};

export default function Dashboard() {
  const router = useRouter();
  const [exams, setExams] = useState<TExam[]>([]);
  const [testsMap, setTtestsMap] = useState<TTestMap>({});
  const { exams: storedExams, getExams } = useExamStore();
  const { openModal, closeModal } = useModal();
  const { createTest, getTests, tests, error, clearError } = useTestStore();
  const { getRandomTag } = useTagStore();

  useEffect(() => {
    (async () => {
      await getExams();
      await getTests();
    })();
  }, []);

  useEffect(() => {
    const d = {} as TTestMap;
    tests.forEach((t) => {
      if (!d[t.examId]) {
        d[t.examId] = [t.id];
        return;
      }
      d[t.examId].push(t.id);
    });
    setTtestsMap(d);
  }, [tests]);

  useEffect(() => {
    const d = [] as TExam[];
    storedExams.forEach((e) => {
      d.push(e);
    });
    setExams(d);
  }, [storedExams.size]);

  useEffect(() => {
    if (!error) {
      return;
    }
    toast.error(error);
    clearError();
  }, [error]);

  const handleJoinTest = async (examId: string) => {
    closeModal();
    const t = await createTest(examId);
    if (!t) {
      return;
    }

    await getRandomTag(examId);
    router.push(`/exam/${examId}`);
  };

  const handleRedirectExamDetail = (exam: TExam) => {
    const dialogContentByStatus: {
      [k: string]: Omit<ConfirmTestProps, "onClose">;
    } = {
      active: {
        title: `Xác nhận thi môn ${exam.topic}`,
        message: "Thao tác này không thể hoàn tất, bạn có muốn thi không?",
        onConfirm: () => handleJoinTest(exam.id),
        confirmText: "Bắt đầu",
        cancelText: "Hủy bỏ",
      },
      pending: {
        title: `Bài thi ${exam.topic} chưa được mở`,
        message: "Vui lòng đợi giáo viên mở đề thi này",
        cancelText: "Đóng",
        status: "pending",
      },
    };
    openModal(
      ConfirmTest,
      {
        ...dialogContentByStatus[exam.status],
      },
      { size: "md" }
    );
  };

  return (
    <div className="flex flex-col items-center h-screen pt-[70px] overflow-y-auto ">
      <Header />
      {exams.length ? (
        <div className="flex flex-col w-full items-center mt-4 flex-1 ">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg lg:w-9/12 pb-3 overflow-x-hidden ">
            {/* flex-grow */}
            {exams.map((e, index) => (
              <CardHome
                examId={e.id}
                isCompleted={!!testsMap[e.id]?.length}
                onClick={() => handleRedirectExamDetail(e)}
                key={index}
                examTime={e ? e.examTime : 0}
                topic={e ? e.topic : ""}
                status={e ? e.status : "inactive"}
                description={e ? e.description : ""}
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
