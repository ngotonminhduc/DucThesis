import { SubmitAnswers } from "@/utils/type";
import { create } from "zustand";


interface SubmitUserExamState {
  userSubmitExam: SubmitAnswers;
  testId: string;
  setUserSubmitExam: (exam: SubmitAnswers) => void;
  addUserSubmitExam: (data: SubmitAnswers) => void;
  updateUserSubmitExam: (data: Partial<SubmitAnswers>) => void;
  clearUserSubmitExam: () => void;

  setUserTest: (testId: string) => void;
  addUserTest: (testId: string) => void;
  updateUserTest: (testId: string) => void;
  clearUserTest: () => void;
}

export const useUserSubmitExamStore = create<SubmitUserExamState>((set, get) => ({
  userSubmitExam: { answers: {} },
  testId: '',

  setUserSubmitExam: (exam) => set({ userSubmitExam: exam }),
  addUserSubmitExam: (data) => {
    // console.log("Adding answers:", data.answers);
    set((state) => ({
      userSubmitExam: {
        answers: {
          ...state.userSubmitExam.answers,
          ...Object.keys(data.answers).reduce((acc, key) => {
            acc[key] = data.answers[key]; // Ghi đè câu trả lời mới nhưng giữ lại các câu cũ
            return acc;
          }, {} as { [questionId: string]: string[] }),
        },
      },
    }));
  },
  updateUserSubmitExam: (data) => {
    console.log("Updating answers:", data.answers);
    set((state) => ({
      userSubmitExam: {
        answers: {
          ...state.userSubmitExam.answers,
          ...data.answers,
        },
      },
    }));
  },
  clearUserSubmitExam: () => set({ userSubmitExam: { answers: {} } }),



  // Xử lý testId
  setUserTest: (testId) => set({ testId }),
  addUserTest: (testId) => {
    set((state) => ({
      testId: state.testId ? state.testId : testId, // Chỉ cập nhật nếu chưa có
    }));
  },
  updateUserTest: (testId) => set({ testId }),
  clearUserTest: () => set({ testId: "" }),
}));
