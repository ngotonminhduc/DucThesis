"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { CardExam } from "@/components/card/CardExam";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/effect/Spinner";
import { Button } from "@/components/button/Button";
import { useQuestionStore } from "@/store/question-store";
import { TExam } from "@/services/examService";
import { useExamStore } from "@/store/exam-store";
import { XCircleIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import ConfirmCancelTesting from "@/components/exam/Dialog/ConfirmCancelTesting";
import TestQuestion from "@/components/exam/Question/TestQuestion";
import { TQuestion } from "@/services/questionService";
import TestExamHeader from "@/components/exam/ExamHeader/TestExamHeader";
import { useTestStore } from "@/store/test-store";
import { TAnswerMap } from "@/services/testService";
import { useTagStore } from "@/store/tag-store";
import { arrayToObject } from "@/utils/array";

type TStudentAnswer = {
  questionId: string;
  examId: string;
  answer: string | null;
  answerIds: string[];
};

function StudentExamPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { detailExam, exams } = useExamStore();
  const { getQuestions, questions: storedQuestions } = useQuestionStore();
  const [questions, setQuestions] = useState<TQuestion[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<TStudentAnswer[]>([]);
  const studentAnswersRef = useRef<TStudentAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [exam, setExam] = useState<TExam>();
  const { selectedTag } = useTagStore();
  const { openModal, closeModal } = useModal();
  const { caculateTestScore, startTest, activeTest } = useTestStore();
  const activeTestRef = useRef(activeTest);
  const timeLefRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeLeft < 1 && timerRef.current !== null) {
      handleSubmitExam();
    }
    timeLefRef.current = timeLeft;
  }, [timeLeft]);

  const handleSubmitAfterLoadPage = useCallback(async () => {
    const sessionTestId = sessionStorage.getItem("testId");
    const sessionAnswers = sessionStorage.getItem("answers");
    if (!sessionTestId || !sessionAnswers) {
      return false;
    }
    const cacheTestId = String(sessionTestId);
    const cacheAnswers = JSON.parse(sessionAnswers) as TStudentAnswer[];
    const answersMap = getAnswersMap(cacheAnswers);
    await caculateTestScore(cacheTestId, answersMap);
    router.push(`/result/${cacheTestId}`);
    sessionStorage.clear();
    return true;
  }, []);

  useEffect(() => {
    const handleBeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    const handleUnload = () => {
      sessionStorage.setItem(
        "answers",
        JSON.stringify(studentAnswersRef.current)
      );
      sessionStorage.setItem("testId", activeTestRef.current?.id ?? "");
    };
    const handleCloseTab = (e: Event) => {
      e.preventDefault();
      handleUnload();
    };
    window.addEventListener("beforeunload", handleBeforeunload);
    window.addEventListener("unload", handleUnload);
    window.addEventListener("close", handleBeforeunload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeunload);
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("close", handleCloseTab);
    };
  }, [examCompleted]);

  useEffect(() => {
    studentAnswersRef.current = studentAnswers;
  }, [studentAnswers]);

  useEffect(() => {
    activeTestRef.current = activeTest;
  }, [activeTest]);

  const startTimer = useCallback((duration: number) => {
    setTimeLeft(duration);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    (async () => {
      const isSubmitted = await handleSubmitAfterLoadPage();
      if (isSubmitted) {
        return;
      }
    })();
    const initializeExam = async () => {
      await detailExam(params.id);
      await startTest(params.id);
      await getQuestions(params.id);
    };
    initializeExam();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeTest) {
      return;
    }

    if (activeTest.status !== "TakingATest") {
      router.push("/dashboard");
      return;
    }
  }, [activeTest]);

  useEffect(() => {
    const currentExam = exams.get(params.id);
    if (currentExam?.examTime) {
      setExam(currentExam);
      const examDuration = currentExam.examTime;
      startTimer(examDuration);
    }
  }, [exams.get(params.id)]);

  useEffect(() => {
    if (!selectedTag || !questions.length) {
      return;
    }
  }, [selectedTag, storedQuestions[params.id]]);

  useEffect(() => {
    if (!storedQuestions[params.id] || !selectedTag) {
      return;
    }
    if (storedQuestions[params.id].length > 0) {
      const questionsMap = arrayToObject(
        storedQuestions[params.id],
        "idx",
        (q) => q
      );
      const sortedQuestions = selectedTag.mixQuestions.map(
        (idx) => questionsMap[idx]
      );
      const availableAnswers = sortedQuestions.map((question) => ({
        questionId: question.id,
        examId: params.id,
        answer: question.type === "Essay" ? "" : null,
        answerIds: [],
      }));
      setQuestions(sortedQuestions);
      setStudentAnswers(availableAnswers);
    }
  }, [storedQuestions[params.id], selectedTag]);

  const handleAnswerChange = (questionIndex: number, answerId: string) => {
    if (examCompleted) return;

    setStudentAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex].answerIds = [answerId];
      return newAnswers;
    });
  };

  const handleEssayAnswer = (questionIndex: number, text: string) => {
    if (examCompleted) return;

    setStudentAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[questionIndex].answer = text;
      return newAnswers;
    });
  };

  const getAnswersMap = useCallback((sas: TStudentAnswer[]) => {
    const answersMap = {} as TAnswerMap;
    sas.forEach((sa) => {
      answersMap[sa.questionId] = sa.answer ? [sa.answer] : sa.answerIds;
    });
    return answersMap;
  }, []);

  const handleConfirmCancelTesting = async () => {
    closeModal();
    if (examCompleted) {
      return;
    }
    const answersMap = getAnswersMap(studentAnswersRef.current);
    if (!activeTestRef.current) {
      toast.error("Không tìm thấy bài thi");
      return;
    }
    const testId = activeTestRef.current.id;
    try {
      const success = await caculateTestScore(testId, answersMap);

      if (success) {
        toast.success("Đã lưu kết quả và rời phòng thi");
        router.push(`/result/${testId}`);
        setExamCompleted(true);
      } else {
        toast.error("Lưu kết quả thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý kết quả");
    }
  };

  const handleCancelTesting = useCallback(() => {
    openModal(
      ConfirmCancelTesting,
      {
        title: "Rời phòng thi",
        message: "Bạn có chắc chắn muốn rời phòng thi không?",
        onConfirm: handleConfirmCancelTesting,
        confirmText: "Rời",
        cancelText: "Tiếp tục thi",
      },
      { size: "sm" }
    );
  }, []);

  const handleSubmitExam = async () => {
    if (isSubmitting || examCompleted) return;
    setIsSubmitting(true);
    const answersMap = getAnswersMap(studentAnswersRef.current);

    if (!activeTestRef.current) {
      setIsSubmitting(false);
      return;
    }
    const testId = activeTestRef.current.id;

    const r = await caculateTestScore(testId, answersMap);
    if (!r) {
      toast.error("Nộp bài thất bại!");
      setIsSubmitting(false);
      return;
    }
    setExamCompleted(true);
    toast.success("Nộp bài thành công!");
    setTimeout(() => {
      router.push(`/result/${testId}`);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {exam ? (
        <CardExam className="bg-white shadow-lg rounded-xl overflow-hidden">
          <TestExamHeader code={selectedTag?.code ?? ''} exam={exam} timeLeft={timeLeft} />
          <div className="p-6 space-y-8">
            {questions.map((question, i) => (
              <TestQuestion
                key={i}
                examCompleted={examCompleted}
                incrementId={i}
                onAnswerChange={handleAnswerChange}
                onEssayAnswerChange={handleEssayAnswer}
                studentAnswers={studentAnswers}
                val={question}
              />
            ))}
          </div>

          {/* Control Panel */}
          <div className="bg-gray-50 p-4  border-t flex justify-between">
            <Button
              customStyle="bg-red-400 cursor-pointer rounded-sm hover:bg-red-600 px-6 py-3"
              onClick={handleCancelTesting}
              text="Rời phòng thi"
              icon={<XCircleIcon className="w-5 h-5 mr-2" />}
            />
            <Button
              text={examCompleted ? "Đã nộp" : "Nộp bài"}
              customStyle={`bg-green-400 cursor-pointer rounded-sm hover:bg-green-600 px-8 py-3 transition-all
          ${examCompleted && "opacity-50 cursor-not-allowed"}`}
              onClick={handleSubmitExam}
              disabled={isSubmitting || examCompleted}
              loading={isSubmitting}
            />
          </div>
        </CardExam>
      ) : (
        <div className="text-center py-12">
          <Spinner />
          <p className="mt-4 text-gray-600">Đang tải bài thi...</p>
        </div>
      )}
    </div>
  );
}

export default React.memo(StudentExamPage);
