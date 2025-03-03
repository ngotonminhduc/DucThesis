"use client";

import { useState, useEffect, useMemo } from "react";
import { useExamStore } from "@/store/exam-store";
import { useRouter } from "next/navigation";
import { QuestionAnswers } from "@/components/exam/QuestionAnswers";
import { TopicExam } from "@/components/exam/TopicExam";
import { ulid } from "ulidx";
import { toast } from "react-toastify";
import Image from "next/legacy/image";
import { logo } from "../../../../public";
import { wh_logo_medium } from "@/utils/constants";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import ApiService from "@/utils/api";
import { ResponseExam, ResponseQuestion } from "@/utils/type";
import { useGlobalStore } from "@/store/global-store";
import { CardExam } from "@/components/card/CardExam";




export default function Exam() {
  const router = useRouter();
  const { createStatusCreateUpdate } = useGlobalStore()
  
  const {
    updateExam,
    setQuestions,
    questions,
    exam,
    clearQuestions,
    clearAnswers,
    clearExam
  } = useExamStore();
  const questionExam = useExamStore.getState().exam?.questions;

  
  useEffect(()=>{
    setQuestions([
      {
        id:'',
        examId:'',
        content:"",
        createdAt:"",
        answers: [
          {
            id:"",
            questionId:"",
            examId:"",
            content: '',
            isCorrect: false,
            createdAt:"",
          }
        ]
      }
    ])
  },[])

  const questionsWithIds = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      id: ulid(),
      answers: q.answers.map((a) => ({
        ...a,
        id: ulid(),
      })),
    }));
  }, [questions]);
  
  
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // 🟢 Bước 1: Tạo bài kiểm tra
      const resExam: ResponseExam = await ApiService.post("/exam/create", {
        topic: exam?.topic,
        description: exam?.description,
        status: exam?.status,
        examTime: Number(exam?.examTime) || 0,
      });
      console.log('questions onSubmit: ', questions);
  
      // 🟢 Bước 2: Tạo tất cả câu hỏi và nhận lại danh sách questionId
      const resQuestions = await Promise.all(
        questions.map(async (q) => {
          const resQuestion: ResponseQuestion = await ApiService.post("/question/create", {
            examId: resExam.data.id,
            content: q.content,
          });
  
          console.log("Question created:", resQuestion.data);
  
          // 🟢 Bước 3: Tạo tất cả câu trả lời của câu hỏi hiện tại
          await Promise.all(
            q.answers.map(async (a) => {
              const resAnswer = await ApiService.post("/answer/create", {
                examId: resExam.data.id,
                questionId: resQuestion.data.id,
                content: a.content,
                isCorrect: a.isCorrect,
              });
            })
          );
  
          return resQuestion.data; // Trả về dữ liệu câu hỏi đã tạo
        })
      );
      createStatusCreateUpdate('Created successfully!',true)
      router.back()
      clearExam();
      clearQuestions();
      clearAnswers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error creating exam");
      console.error("API Error:", error);
    }
  };
  
  const topic = exam?.topic || "";
  const description = exam?.description || "";
  return (
    <form onSubmit={onSubmit}>
      <div className="h-screen pt-[70px] overflow-y-auto">
        <div className="flex w-full justify-between fixed -top-0  items-center h-14 px-5 shadow-md mb-5">
          <div>
            <Image src={logo} alt="Logo" width={wh_logo_medium} height={wh_logo_medium} className="w-12 h-12 mb-4" />
          </div>
          <div className="px-9">
            <button className="bg-green-500 w-36 h-14 rounded-lg" type="submit">Submit</button>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center ">
          <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center ">
            <TopicExam 
              valueTopic={topic}
              valueDescription={description}
            />
            {
              questionsWithIds && 
                <QuestionAnswers questionArray={questionsWithIds} 
                />
            }
          </CardExam>
        </div>
      </div>
    </form>
  )
}