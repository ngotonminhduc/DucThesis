"use client";

import { useEffect } from "react";
import { useSubjectQuestionStore } from "@/store/subject-question-store";
import { useSubjectAnswerStore } from "@/store/subject-answer-store";
import Spinner from "../effect/Spinner";
import { TSubjectQuestion } from "@/services/subjectQuestionService";
import { TSubjectAnswer } from "@/services/subjectAnswerService";
import { CardExam } from "../card/CardExam";

export const SubjectQuestionList = ({
  subjectId,
  page,
  pageSize,
  selectedQuestionIds,
  onSelectedQuestionIdsChange,
}: {
  subjectId: string;
  page: number;
  pageSize: number;
  selectedQuestionIds: string[];
  onSelectedQuestionIdsChange: (
    ids: string[],
    question?: TSubjectQuestion,
    answers?: TSubjectAnswer[]
  ) => void;
}) => {
  const {
    subjectQuestions,
    getSubjectQuestions,
    isLoading: loadingQuestions,
  } = useSubjectQuestionStore();
  const {
    subjectAnswers,
    getSubjectAnswers,
    isLoading: loadingAnswers,
  } = useSubjectAnswerStore();

  useEffect(() => {
    if (subjectId) {
      getSubjectQuestions(subjectId, page, pageSize);
    }
  }, [subjectId, page, pageSize]);

  useEffect(() => {
    const questionIds = subjectQuestions[subjectId]?.map((q) => q.id) || [];
    questionIds.forEach((id) => {
      getSubjectAnswers(id);
    });
  }, [subjectQuestions[subjectId]]);

  const toggleSelectQuestion = async (questionId: string) => {
    if (!subjectAnswers[questionId]) {
      await getSubjectAnswers(questionId);
    }

    const question = subjectQuestions[subjectId]?.find(
      (q) => q.id === questionId
    );
    const answers = subjectAnswers[questionId] || [];

    const newSelectedIds = selectedQuestionIds.includes(questionId)
      ? selectedQuestionIds.filter((id) => id !== questionId)
      : [...selectedQuestionIds, questionId];

    onSelectedQuestionIdsChange(newSelectedIds, question, answers);
  };

  if (loadingQuestions || loadingAnswers) return <Spinner />;

  return (
    <div className="space-y-4">
      {subjectQuestions[subjectId]?.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          answers={subjectAnswers[question.id] || []}
          isSelected={selectedQuestionIds.includes(question.id)}
          onToggleSelect={toggleSelectQuestion}
        />
      ))}
    </div>
  );
};

const QuestionItem = ({
  question,
  answers,
  isSelected,
  onToggleSelect,
}: {
  question: TSubjectQuestion;
  answers: TSubjectAnswer[];
  isSelected: boolean;
  onToggleSelect: (questionId: string) => void;
}) => (
  <CardExam className="mt-4 flex flex-col w-full">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">{question.content}</h3>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onToggleSelect(question.id)}
        className="h-5 w-5 cursor-pointer"
      />
    </div>
    <div className="space-y-2 ml-4">
      {answers.slice(0, 10).map((answer) => (
        <div key={answer.id} className="flex items-center space-x-2">
          <input
            type={"radio"}
            className="h-4 w-4"
            checked={answer.isCorrect}
            readOnly
          />
          <span>{answer.content}</span>
        </div>
      ))}
    </div>
  </CardExam>
);
