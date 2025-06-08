"use client";

import { CardExam } from "@/components/card/CardExam";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { ExamHeader } from "@/components/exam/ExamHeader/ExamHeader";
import { useExamStore } from "@/store/exam-store";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/effect/Spinner";
import { Button } from "@/components/button/Button";
import { useQuestionStore } from "@/store/question-store";
import { useAnswerStore } from "@/store/answer-store";
import { TCreateAnswer } from "@/services/answerService";
import { TStateQuestion } from "@/components/exam/Question/type";
import { TExam } from "@/services/examService";
import { useSubjectStore } from "@/store/subject-store";
import { SubjectQuestionList } from "@/components/exam/SubjectQuestionList";
import { PaginationControls } from "@/components/exam/PaginationControls";
import { useSubjectQuestionStore } from "@/store/subject-question-store";
import { useSubjectAnswerStore } from "@/store/subject-answer-store";
import { pageSize } from "@/utils/constants";
import { TSubjectQuestion } from "@/services/subjectQuestionService";
import { TSubjectAnswer } from "@/services/subjectAnswerService";
import { useTagStore } from "@/store/tag-store";

function DetailExamPage() {
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionCache, setQuestionCache] = useState<
    Record<
      string,
      {
        question: TSubjectQuestion;
        answers: TSubjectAnswer[];
      }
    >
  >({});

  const { updateExam, detailExam, exams, error, isLoading, clearError } =
    useExamStore();
  const { getSubjects } = useSubjectStore();
  const { getSubjectQuestions, subjectQuestions, totalCount } =
    useSubjectQuestionStore();

  const [questions, setQuestions] = useState<TStateQuestion[]>([]);
  const {
    getQuestions,
    error: questionError,
    questions: storedQuestions,
    isLoading: isQuestionLoading,
    deleteAllQuestions,
    createQuestion,
    clearError: clearQuestionError,
  } = useQuestionStore();
  const { createAnswers, deleteAllAnswers } = useAnswerStore();
  const { deleteAllTags, createTags } = useTagStore();

  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const { subjectAnswers } = useSubjectAnswerStore();
  const [exam, setExam] = useState<TExam>();

  useEffect(() => {
    const initialSelectedIds =
      storedQuestions[params.id]?.map((q) => q.subjectQuestionId) || [];
    setSelectedQuestionIds(initialSelectedIds);
  }, [storedQuestions[params.id]]);

  useEffect(() => {
    const selectedQuestions = selectedQuestionIds
      .map((id) => {
        const cached = questionCache[id];
        if (!cached) return null;

        return {
          examId: params.id,
          content: cached.question.content,
          type: cached.question.type,
          subjectQuestionId: cached.question.id,
          answers: cached.answers.map((a) => ({
            id: a.id,
            content: a.content,
            isCorrect: a.isCorrect,
          })),
        };
      })
      .filter(Boolean) as TStateQuestion[];

    setQuestions(selectedQuestions);
  }, [selectedQuestionIds, questionCache]);

  useEffect(() => {
    const validSelectedIds = selectedQuestionIds.filter(
      (id) => !!questionCache[id]
    );
    if (validSelectedIds.length !== selectedQuestionIds.length) {
      setSelectedQuestionIds(validSelectedIds);
    }
  }, [questionCache]);

  useEffect(() => {
    (async () => {
      await detailExam(params.id);
      await getQuestions(params.id);
      await getSubjects();
    })();
  }, []);

  useEffect(() => {
    if (!selectedSubjectId || !subjectQuestions[selectedSubjectId]) return;

    // Tạo cache mới từ dữ liệu subject questions và answers hiện có
    const newCache = { ...questionCache };

    subjectQuestions[selectedSubjectId].forEach((question) => {
      const answers = subjectAnswers[question.id] || [];
      if (!newCache[question.id]) {
        newCache[question.id] = {
          question,
          answers,
        };
      }
    });

    setQuestionCache(newCache);
  }, [subjectQuestions, subjectAnswers, selectedSubjectId]);

  useEffect(() => {
    selectedSubjectId && getSubjectQuestions(selectedSubjectId);
  }, [selectedSubjectId]);

  useEffect(() => {
    if (!exams.get(params.id)) return;
    setExam(exams.get(params.id));
  }, [exams.get(params.id)]);

  useEffect(() => {
    exam && setSelectedSubjectId(exam.subjectId);
  }, [exam]);

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isQuestionLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  useEffect(() => {
    if (questionError) {
      toast.error(questionError);
      clearQuestionError();
    }
  }, [questionError]);

  const handleUpdateExamState = useCallback((data: TExam) => {
    setExam(data);
    setCanUpdate(!!data.topic && !!data.description && data.examTime > 0);
  }, []);

  const handleCancel: MouseEventHandler<HTMLButtonElement> = async () => {
    router.push("/admin/dashboard");
  };

  const handleQuestionIdsChange = (
    newIds: string[],
    question?: TSubjectQuestion,
    answers?: TSubjectAnswer[]
  ) => {
    setSelectedQuestionIds(newIds);

    if (question && answers) {
      setQuestionCache((prev) => ({
        ...prev,
        [question.id]: { question, answers },
      }));
    }
  };

  const handleUpdateExam: MouseEventHandler<HTMLButtonElement> = async () => {
    if (!exam) return;

    const { id, ...exm } = exam;
    if (exm.status === "active") {
      const isConfirm = confirm(
        "Bạn có chắc là muốn active bài thi không? Nếu cập nhật sẽ không thể sửa được nữa"
      );
      if (!isConfirm) return;
    }

    await updateExam(id, exm);
    await deleteAllQuestions(params.id);
    await deleteAllAnswers(params.id);
    await deleteAllTags(params.id);

    const bulkAnswers = await questions.reduce(async (prev, cur, i) => {
      const { answers: ads, ...qd } = cur;
      const nq = await createQuestion({ ...qd, idx: i });
      const d = await prev;
      const a =
        qd.type === "Essay"
          ? []
          : (ads
              ?.map(({ id, ...a }, i2) => ({
                ...a,
                questionId: nq?.id!,
                idx: i2,
              }))
              .filter(Boolean) as TCreateAnswer[] | undefined) ?? [];
      return [...d, ...a];
    }, Promise.resolve<TCreateAnswer[]>([]));

    if (bulkAnswers.length) {
      await createAnswers(bulkAnswers);
    }
    await createTags(params.id);
    router.push("/admin/dashboard");
  };

  return (
    <>
      {!isLoading ? (
        <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center ">
          <ExamHeader
            onUpdateItem={handleUpdateExamState}
            val={exam}
            selectedSubjectId={selectedSubjectId}
            questionLength={selectedQuestionIds.length}
          />

          {selectedSubjectId && (
            <div className="w-full">
              <SubjectQuestionList
                subjectId={selectedSubjectId}
                page={currentPage}
                pageSize={pageSize}
                selectedQuestionIds={selectedQuestionIds}
                onSelectedQuestionIdsChange={handleQuestionIdsChange}
              />

              <PaginationControls
                currentPage={currentPage}
                totalPages={Math.ceil(totalCount / pageSize)}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          <div className="w-full flex justify-between p-2">
            <Button
              customStyle="order-first cursor-pointer bg-red-500 hover:bg-red-600 rounded-sm p-2 text-center w-24 text-gray-50"
              text="Quay lại"
              onClick={handleCancel}
            />
            {exams.get(params.id)?.status === "pending" && (
              <Button
                customStyle={`order-first ${
                  canUpdate
                    ? "cursor-pointer bg-green-500 hover:bg-green-600"
                    : "cursor-not-allowed bg-gray-400"
                } rounded-sm p-2 text-center w-24 text-gray-50`}
                text="Cập nhật"
                onClick={handleUpdateExam}
              />
            )}
          </div>
        </CardExam>
      ) : (
        <Spinner />
      )}
      <div ref={scrollBottomRef}></div>
    </>
  );
}

export default React.memo(DetailExamPage);
