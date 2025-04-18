import { useState } from "react";
import { CardExam } from "../card/CardExam";
import { InputAnswer } from "../input/InputAnswer";
import { Questions, ItemAnswer } from "@/utils/type";
import { AnswersClient } from "./AnswerClient";
import { useUserSubmitExamStore } from "@/store/submitExam-strore";



export type QuestionAnswersClientProps = {
  questions: Questions[];
  disabledAns?: boolean;
};



export const QuestionAnswersClient = ({ questions, disabledAns }: QuestionAnswersClientProps) => {
  const { addUserSubmitExam } = useUserSubmitExamStore();
  const [selectedAnswers, setSelectedAnswers] = useState<{ id: string; questionId: string; examId: string }[]>([]);
  const correctAnswer = questions.flatMap(val => val.answers.filter(e => e.isCorrect));
  
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    const newAnswer = {[questionId]: [answerId],};
    addUserSubmitExam({ answers: newAnswer });

    setSelectedAnswers((prev) => {
      const updatedAnswers = prev.filter((ans) => ans.questionId !== questionId);
      return [...updatedAnswers, { id: answerId, questionId, examId: questions[0]?.examId || "" }];
    });
  };

  return (
    <>
      {questions.map((q,indexQues) => (
        <CardExam key={q.id} className="mt-4 flex flex-col w-full">
          <div className="flex items-center w-full">
            <InputAnswer
              key={`question-${q.id}`}
              name={`questions[${q.id}].content`}
              placeholder="Nhập câu hỏi?"
              style="rounded-md shadow-lg xl:w-[50rem] lg:w-[30rem] md:w-[12rem] sm:w-[5rem]"
              value={q.content}
              disabled={true}
            />
          </div>

          {q.answers.map((a, indexAns) => {
            // console.log("🚀 ~ {q.answers.map ~ a:", a)
            return (
              <div key={a.id}>
                {
                  q.type === 'MultipleChoice' && 
                  <AnswersClient
                    key={a.id}
                    answers={a}
                    selectedOption={
                      selectedAnswers.find((ans) => ans.questionId === q.id)?.id || ""
                    }
                    onSelect={(answerId) => handleAnswerSelect( q.id, answerId )}
                    disabled={disabledAns}
                  />
                }
                {
                  q.type === 'Essay' && 
                  <textarea onChange={(e) => handleAnswerSelect( q.id, e.target.value  )} className="w-full mt-5 border" />
                }
              </div>
            )
          }
          )}
        </CardExam>
      ))}
    </>
  );
};
