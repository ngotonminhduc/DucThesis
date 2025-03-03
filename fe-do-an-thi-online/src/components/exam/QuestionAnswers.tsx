import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { CardExam } from "../card/CardExam";
import { InputAnswer } from "../input/InputAnswer";
import { InputForm } from "../input/InputForm";
import { ExamFormData, ItemAnswer, ListAnswer, Questions } from "@/utils/type";
import { ulid } from "ulidx";
import { AddAnswer } from "./AddAnswer";
import { useExamStore } from "@/store/exam-store";
import { debounce } from "lodash";
import { BottomRightButtonAddQues } from "../button/BottomRightButtonAddQues";
import ApiService from "@/utils/api";
import { Trash } from "lucide-react";
import { useGlobalStore } from "@/store/global-store";

export type QuestionAnswersProps = {
  questionArray: Questions[];
  isUpdate?: boolean,
};

export const QuestionAnswers = ({
  questionArray,
  isUpdate
}: QuestionAnswersProps) => {
  const [disable, setDisable] = useState<boolean>(false);
  const [questionsArr, setQuestionsArr] = useState<Questions[]>([]);
  const [questionsText, setQuestionsText] = useState<{ [key: number]: string }>(
    () => Object.fromEntries(questionArray.map((q, i) => [i, q.content ?? ""]))
  );
  
  const { removeQuestion, updateQuestion, removeAnswer, addAnswer, updateAnswer, addQuestion, questions} = useExamStore();


  useEffect(() => {
    const debouncedUpdate = debounce((index: number, content: string) => {
      updateQuestion({ index, content });
    }, 1000);
  
    Object.entries(questionsText).forEach(([index, content]) => {
      debouncedUpdate(Number(index), content);
    });
  
    return () => debouncedUpdate.cancel();
  }, [questionsText]);
  

  const handleAddAnswer = (questionIndex: number) => {
    const ques = questions[questionIndex]    
    const lastItem = ques.answers.map(e => e).pop();

    addAnswer({
      questionIndex,
      answer: {
        questionId: ques && ques.id ? ques.id : "",
        content: "",
        isCorrect: false,
        id: '',
        examId: ques && ques.examId ? ques.examId : '',
        createdAt: ''
      },
    });
  };
  const handleAddQuestion = (questionIndex: number) => {
    console.log('handleAddQuestion');
    addQuestion({
      id:"",
      examId:"",
      content:"",
      createdAt:"",
      answers:[
      {
        questionId:"",
        createdAt:"",
        id:"",
        examId:"",
        content:"",
        isCorrect:false,
      }
    ]}
  );
  };
  // const onChangeQuestion = (questionIndex: number, content:string  ) =>{
  //   console.log('content11111111111: ', content);
  //   updateQuestion({index: questionIndex, content})
  // }
  const onRemoveItem = async (examId: string, questionIndex: number, answerIndex: number) => {
    if (examId !== "") {
      const resExam:any = await ApiService.post("/exam/answer",{ examId })
    }
    removeAnswer({questionIndex, answerIndex})
  }
  const onRemoveQuesItem = async (examId: string, questionIndex: number, answerIndex?: number) => {
    if (examId !== "") {
      const resExam:any = await ApiService.post("/answer/delete",{ examId })
    }
    removeQuestion(questionIndex)
    // removeAnswer({questionIndex, answerIndex})
  }

  const onChangeAnswer = debounce((v: string, questionIndex: number, answerIndex: number) =>{
    updateAnswer({answerIndex,questionIndex,content: v, isCorrect: false})
  },500)
  
  const onRadioChange = (questionIndex: number, answerIndex: number) => {
    updateAnswer({ answerIndex, questionIndex, content: questions[questionIndex].answers[answerIndex].content, isCorrect: true });
  
    // Đặt tất cả các đáp án khác thành false
    questions[questionIndex].answers.forEach((_, idx) => {
      if (idx !== answerIndex) {
        updateAnswer({ answerIndex: idx, questionIndex, content: questions[questionIndex].answers[idx].content, isCorrect: false });
      }
    });
  };

  return (
    <>
      {questionArray.map((q,i) => (
        <CardExam key={`${q.id}${q.examId}${i}`} className="mt-4 flex flex-col w-full">
          <div className="flex items-center w-full">
            <InputAnswer
              key={`question${i}${q.examId}`} 
              name={`questions[${i}].content`}
              placeholder="Nhập câu hỏi?"
              style="rounded-md xl:w-[50rem] lg:w-[30rem] md:w-[12rem] sm:-[5rem]"
              value={questionsText[i] ?? q.content} 
              onChange={(value) => {
                setQuestionsText((prev) => ({
                  ...prev,
                  [i]: value,
                }));
              }}
            />
            <div className="flex justify-center items-center w-full ">
              <button onClick={() => onRemoveQuesItem(q.examId,i)} type="button" className="w-full flex justify-center items-center " >
                <Trash className=" text-red-500 w-5"/>
              </button>
            </div>
          </div>
          {q.answers.map((a,idx) => (
            <div>
              <div key={`content-${idx}-${a.content}`} className="justify-center items-center">
                <InputForm
                  placeholder="Nhập câu trả lời"
                  disable={disable}
                  containerStyle="mt-5 w-10/12"
                  onChangeText={(v) => onChangeAnswer(v, i, idx)}
                  defaultText={a.content}
                  name={`questions[${i}].answers[${idx}].content`}
                  nameRadio={`questions[${i}].answers[${idx}].isCorrect`}
                  isChecked={a.isCorrect}
                  onRadioChange={() => onRadioChange(i, idx)}
                  onRemoveItem={() => onRemoveItem(a.examId,i, idx)}
                />
              </div>
            </div>
          ))}
          <AddAnswer onClick={() => handleAddAnswer(i)}/>
          <BottomRightButtonAddQues
            onClick={() => handleAddQuestion(i)}/>
        </CardExam>
      ))}
    </>
  );
};
