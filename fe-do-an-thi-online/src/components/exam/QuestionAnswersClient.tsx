import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { CardExam } from "../card/CardExam";
import { InputAnswer } from "../input/InputAnswer";
import { Questions } from "@/utils/type";
import { ulid } from "ulidx";
import { useExamStore } from "@/store/exam-store";
import { AnswersClient } from "./AnswerClient";


export type QuestionAnswersClientProps = {
  questions: Questions[];
};

export const QuestionAnswersClient = ({
  questions,
}: QuestionAnswersClientProps) => {
  const [selectedOption, setSelectedOption] = useState('')

  return (
    <>
      {questions.map((q) => (
        <CardExam key={q.id} className="mt-4 flex flex-col w-full">
          <div className="flex items-center w-full">
            <InputAnswer
              key={`question-${q.id}`} 
              name={`questions[${q.id}].content`}
              placeholder="Nhập câu hỏi?"
              style="rounded-md shadow-lg xl:w-[50rem] lg:w-[30rem] md:w-[12rem] sm:-[5rem]"
              value={q.content} 
              disabled={true}
            />
          </div>
          {q.answers.map((a) => (
            <div key={a.id}>
              <AnswersClient
                key={a.id}
                answers={a}
                selectedOption={selectedOption}
                onSelect={(e) => {
                  setSelectedOption(e)
                }}
              />
            </div>
          ))}
        </CardExam>
      ))}

    </>
  );
};
