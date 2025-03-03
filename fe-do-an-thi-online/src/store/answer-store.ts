import { create } from "zustand";
import { Answer } from "@/utils/type";

interface AnswersState {
  answers: Answer[];
  setAnswers: (newAnswers: Answer[]) => void;
  addAnswer: (params: Answer) => void;
  updateAnswer: (params: { index: number; content: string; isCorrect: boolean }) => void;
  removeAnswer: (index: number) => void;
  clearAnswers: () => void;
}

export const useAnswersStore = create<AnswersState>((set, get) => ({
  answers: [],

  setAnswers: (newAnswers) => set({ answers: newAnswers }),

  addAnswer: ({ content, isCorrect }) => {
    set((state) => ({
      answers: [...state.answers, { content, isCorrect }],
    }));
  },

  updateAnswer: ({ index, content, isCorrect }) => {
    set((state) => {
      if (index < 0 || index >= state.answers.length) {
        console.warn(`Invalid index ${index}.`);
        return state;
      }
      return {
        answers: state.answers.map((answer, i) =>
          i === index ? { content, isCorrect } : answer
        ),
      };
    });
  },

  removeAnswer: (index) => {
    set((state) => {
      if (index < 0 || index >= state.answers.length) {
        console.warn(`Invalid index ${index}.`);
        return state;
      }
      return {
        answers: state.answers.filter((_, i) => i !== index),
      };
    });
  },

  clearAnswers: () => set({ answers: [] }),
}));
