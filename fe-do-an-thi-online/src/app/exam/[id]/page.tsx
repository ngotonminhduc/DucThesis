"use client";

import Image from "next/legacy/image";
import { logo } from "../../../../public";
import { wh_logo_medium } from "@/utils/constants";
import { TopicExam } from "@/components/exam/TopicExam";
import { useEffect, useState } from "react";
import { 
  ItemExam,
  ListAnswer,
  ListQuestion,
  ListUpdateQuestion,
  ResponseAnswers,
  ResponseExam,
  ResponseExams,
  ResponseQuestion,
  ResponseQuestions,

 } from "@/utils/type";
import ApiService from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useExamStore } from "@/store/exam-store";
import { toast } from "react-toastify";
import { useGlobalStore } from "@/store/global-store";
import { CardExam } from "@/components/card/CardExam";
import { formatTime } from "@/utils/formatTime";
import { QuestionAnswersClient } from "@/components/exam/QuestionAnswersClient";


const page = () => {
  const params = useParams();
  const router = useRouter();
  const [itemExam, setItemExam] = useState<ItemExam>(null)
  const {
    updateExam,
    setQuestions,
    questions,
    exam,
    clearExam,
    clearAnswers,
    clearQuestions,
    setExam,
    } = useExamStore();
  const { createStatusCreateUpdate } = useGlobalStore()
  
  const [questionAnswers, setQuestionAnswers] = useState<ListUpdateQuestion | []>([])

  const [user, setUser] = useState(null);
  const [timeStamp, setTimeStamp] = useState<number>(itemExam && itemExam.examTime > 0 ? itemExam.examTime : 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    if (itemExam && itemExam.examTime > 0) {
      setTimeStamp(itemExam.examTime);
    }
  }, [itemExam]);
  
  useEffect(() => {
    if (timeStamp > 0) {
      const interval = setInterval(() => {
        setTimeStamp((prev) => Math.max(prev - 1, 0));
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [timeStamp]);
  

  useEffect(() => {
    const getExam = async () => {
      const resExam: ResponseExam = await ApiService.get("/exam/get",{ id: params.id });
      const questions: ResponseQuestions = await ApiService.get("/question/gets",{ examId: params.id });
      const answers: ResponseAnswers = await ApiService.get("/answer/gets",{ examId: params.id });
      setItemExam(resExam.data)
      const updatedQuestions = questions.data.questions.map((question) => ({
        ...question,
        answers: answers.data.answers.filter((answer) => answer.questionId === question.id),
      }));
      useExamStore.getState().setExam({
        ...resExam.data,
        questions: updatedQuestions,
      });
      useExamStore.getState().setQuestions(updatedQuestions);
      useExamStore.getState().setAnswers(answers.data.answers);
      setQuestionAnswers(updatedQuestions);
    }
    getExam()
    
  },[params.id])
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("exam onSubmit: ", exam);
  
    try {
      // Step 1: Update Exam
      const resExam: ResponseExam = await ApiService.patch("/exam/update", {
        id: params.id,
        topic: exam?.topic,
        description: exam?.description,
        status: exam?.status,
        examTime: Number(exam?.examTime),
      });
  
      const questionCount = questionAnswers.length - 1; // Store initial length to avoid mutation issues
  
      // Step 2: Process Questions and Answers
      await Promise.all(
        questions.map(async (q, idx) => {
          const index = idx++
          let questionId = q.id;
  
          if (q.id === "" && questionCount !== index) {
            const createQues = await ApiService.post<ResponseQuestion>("/question/create", {
              examId: params.id,
              content: q.content,
            });
            questionId = createQues.data.id;
          } else {
            await ApiService.patch("/question/update", {
              id: q.id,
              content: q.content,
            });
          }
  
          // Step 3: Create/Update Answers
          await Promise.all(
            q.answers.map(async (a, i) => {
              if (a.id === "" && questionCount !== index) {
                await ApiService.post("/answer/create", {
                  examId: params.id,
                  content: a.content,
                  questionId,
                  isCorrect: a.isCorrect,
                });
              } else {
                await ApiService.patch("/answer/update", {
                  id: a.id,
                  content: a.content,
                  isCorrect: a.isCorrect,
                });
              }
            })
          );
        })
      );
  
      createStatusCreateUpdate('Update successfully!',true)
      router.back()
      clearExam();
      clearQuestions();
      clearAnswers();
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      console.error("API Error:", error);
    }
  };
  
  

  return (
    <form onSubmit={onSubmit}>
      <div className="flex justify-between items-center h-14 px-5 shadow-md mb-5">
        <div>
          <Image src={logo} alt="Logo" width={wh_logo_medium} height={wh_logo_medium} className="w-12 h-12 mb-4" />
        </div>
        <div className="px-9">
          <button className="bg-green-500 w-36 h-14 rounded-lg" type="submit">Submit</button>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center ">
        <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center">
          <div className="grid w-full md:grid-cols-2 sm:grid-cols-1 justify-between ">
            <div className="">
              <h3>{itemExam?.description}</h3>
              <h1>{itemExam?.topic}</h1>
            </div>
            <div className="flex flex-col justify-center items-end">
              <h1>Thời gian làm bài</h1>
              <h3 className={`${timeStamp <= 30 && "font-bold text-3xl text-red-600 "}`}>
                {formatTime(timeStamp)}
              </h3>
            </div>
          </div>

          {
            questions && 
            <QuestionAnswersClient 
              questions={questions}
            />
          }
        </CardExam>
      </div>
    </form>
  );
}

export default page