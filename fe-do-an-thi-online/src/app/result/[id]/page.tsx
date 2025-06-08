"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CardExam } from "@/components/card/CardExam";
import { Button } from "@/components/button/Button";
import { useTestStore } from "@/store/test-store";
import Spinner from "@/components/effect/Spinner";
import { ArrowLeftCircle, Home } from "lucide-react";
import TestExamHeader from "@/components/exam/ExamHeader/TestExamHeader";
import { useQuestionStore } from "@/store/question-store";
import ResultSummary from "@/components/result/ResultSummary";
import ResultQuestion from "@/components/result/ResultQuestion";
import { TTest } from "@/services/testService";
import { getSecond } from "@/utils/time";
import { useAnswerStore } from "@/store/answer-store";

function ResultPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { detailTest, tests, isLoading } = useTestStore();
  const { questions, getQuestions } = useQuestionStore();
  const { answers } = useAnswerStore();
  const [test, setTest] = useState<TTest>();

  useEffect(() => {
    (async () => {
      if (tests.get(params.id)) {
        setTest(tests.get(params.id));
        return;
      }
      await detailTest(params.id);
    })();
  }, []);

  useEffect(() => {
    if (!tests.get(params.id)) {
      return;
    }
    setTest(tests.get(params.id));
  }, [tests.get(params.id)]);

  useEffect(() => {
    (async () => {
      if (!test) {
        return;
      }
      if (!test.exam) {
        router.push("/dashboard");
        return;
      }
      await getQuestions(test.exam.id);
    })();
  }, [test]);

  if (isLoading || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <Spinner />
          <p className="mt-4 text-slate-600 font-medium">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  const getTimeLeft = () => {
    if (!test) return 0;
    const timeDone = getSecond(
      new Date(test.finalAt).getTime() - new Date(test.startAt).getTime(),
      "milisecond"
    );
    const r = Math.round((test.exam?.examTime ?? timeDone) - timeDone);
    return r > 0 ? r : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <CardExam className="bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
          <TestExamHeader
            code={test.code}
            exam={test.exam}
            timeLeft={getTimeLeft()}
          />

          <ResultSummary test={test} />

          <div className="p-6 space-y-6">
            {questions[test.examId]?.map((question, i) => {
              const studentAnswers = test.answersMap?.[question.id] || [];
              const correctAnswers =
                test.correctAnswersMap?.[question.id] || [];
              const isCorrect =
                JSON.stringify(studentAnswers) ===
                JSON.stringify(correctAnswers);

              return (
                <ResultQuestion
                  key={i}
                  incrementId={i}
                  userEssayAnswer={studentAnswers[0]}
                  val={question}
                  correctAnswerIds={correctAnswers}
                  answerChoiceIds={studentAnswers}
                  isCorrect={isCorrect}
                />
              );
            })}
          </div>

          <div className="bg-slate-100 p-6 border-t border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <Button
                text="Quay lại"
                customStyle="w-full md:w-auto bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                onClick={() => router.back()}
                icon={<ArrowLeftCircle className="w-5 h-5 text-slate-600" />}
              />
              <Button
                text="Đến trang chủ"
                customStyle="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-indigo-200"
                onClick={() => router.push("/dashboard")}
                icon={<Home className="w-5 h-5 text-white" />}
              />
            </div>
          </div>
        </CardExam>
      </div>
    </div>
  );
}

export default React.memo(ResultPage);
