import { create } from "zustand";
import { Questions } from "@/utils/type";

interface QuestionsState {
  questions: Questions[];
  setQuestions: (questions: Questions[]) => void;
  addQuestion: (examId: string, content: string) => void;
  updateQuestion: (examId: string, newContent: string) => void;
  deleteQuestion: (examId: string) => void;
}

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questions: [],

  setQuestions: (newQuestions) => set({ questions: newQuestions }),

  addQuestion: (examId, content) => {
    set((state) => ({
      questions: [...state.questions, { examId, content, answers: [] }],
    }));
  },

  updateQuestion: (examId, newContent) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.examId === examId ? { ...q, content: newContent } : q
      ),
    }));
  },

  deleteQuestion: (examId) => {
    set((state) => ({
      questions: state.questions.filter((q) => q.examId !== examId),
    }));
  },
}));
