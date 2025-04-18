import { useEffect, useState } from "react";
import { CardExam } from "../card/CardExam";
import { InputAnswer } from "../input/InputAnswer";
import { Questions, ItemAnswer } from "@/utils/type";
import { useUserSubmitExamStore } from "@/store/submitExam-strore";
import { AnswersTestClient } from "./AnswersTestClient";
import { useTestExamStore } from "@/store/test-store";



export type QuestionAnswersClientProps = {
  questions: Questions[];
  disabledAns?: boolean;
};



export const QuestionAnswersTestClient = ({ questions, disabledAns }: QuestionAnswersClientProps) => {
  const { testExam } = useTestExamStore()
  const correctAnswer = questions.flatMap(val => val.answers.filter(e => e.isCorrect));
  const userSelectedAnswers = testExam.answers


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

          {q.answers.map((a, indexAns) => (
            <div key={a.id}>
              <AnswersTestClient
                key={a.id}
                answers={a}
                correctAnswers={correctAnswer.map((ans) => ans.id)} // Danh sách ID câu trả lời đúng từ server
                userAnswer={userSelectedAnswers[q.id]?.includes(a.id) ? a.id : undefined} // Kiểm tra user đã chọn đáp án nào
                disabled={disabledAns}
              />
            </div>
          ))}
        </CardExam>
      ))}
    </>
  );
};
