"use client";

import Image from "next/legacy/image";
import { logo } from "../../../../../public";
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
import { QuestionAnswers } from "@/components/exam/QuestionAnswers";
import { useExamStore } from "@/store/exam-store";
import { toast } from "react-toastify";
import { useGlobalStore } from "@/store/global-store";
import { CardExam } from "@/components/card/CardExam";


const page = () => {
  const params = useParams();
  const router = useRouter();
  const [itemExam, setItemExam] = useState<ItemExam>(null)
  const { createStatusCreateUpdate } = useGlobalStore()
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
  
  
  const [questionAnswers, setQuestionAnswers] = useState<ListUpdateQuestion | []>([])

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
    // console.log("questions onSubmit: ", questions);
  
    try {
      // Step 1: Cập nhật Exam
      await ApiService.patch("/exam/update", {
        id: params.id,
        topic: exam?.topic,
        description: exam?.description,
        status: exam?.status,
        examTime: Number(exam?.examTime),
      });
  
      // Step 2: Xử lý câu hỏi và câu trả lời
      await Promise.all(
        questions.map(async (q) => {
          let questionId = q.id;
  
          // Nếu câu hỏi chưa có ID, tạo mới
          if (!q.id) {
            const createQues = await ApiService.post<ResponseQuestion>("/question/create", {
              examId: params.id,
              content: q.content,
            });
            questionId = createQues.data.id;
          } else {
            // Nếu đã có ID, cập nhật
            await ApiService.patch("/question/update", {
              id: q.id,
              content: q.content,
            });
          }
  
          // Step 3: Duyệt qua danh sách câu trả lời
          await Promise.all(
            q.answers.map(async (a) => {
              if (!a.id) {
                // Nếu câu trả lời chưa có ID, tạo mới
                await ApiService.post("/answer/create", {
                  examId: params.id,
                  content: a.content,
                  questionId,
                  isCorrect: a.isCorrect,
                });
              } else {
                // Nếu đã có ID, cập nhật
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
      router.back();
      clearExam();
      clearQuestions();
      clearAnswers();
    } catch (error: any) {
      console.error("Error updating exam:", error);
      // toast.error(error.response?.data?.message);
    }
  };
  

  return (
    <form onSubmit={onSubmit}>
      <div className="h-screen pt-[70px] overflow-y-auto">
        <div className="flex justify-between items-center w-full mr-8 fixed -top-0  h-14 px-5 shadow-md mb-5 bg-white">
          <div>
            <Image src={logo} alt="Logo" width={wh_logo_medium} height={wh_logo_medium} className="w-12 h-12 mb-4" />
          </div>
          <div className="px-9">
            <button className="bg-green-500 w-36 h-14 rounded-lg" type="submit">Submit</button>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center pb-5 ">
          <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center ">
            <TopicExam 
              valueTopic={itemExam?.topic}
              valueDescription={itemExam?.description}
              valueExamTime={itemExam && itemExam.examTime ? itemExam.examTime+'': ''}
              valueDropdown={itemExam ? itemExam.status: 'pending'}
            />

            {
              questions && 
              <QuestionAnswers 
                questionArray={questions} 
              />
            }
          </CardExam>
        </div>
      </div>
    </form>
  );
}

export default page