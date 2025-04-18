import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  answerService,
  TAnswer,
  TCreateAnswer,
} from "@/services/answerService";

interface AnswerState {
  answers: { [k in string]-?: TAnswer[] };
  isLoading: boolean;
  error: string | null;

  createAnswer: (data: TCreateAnswer) => Promise<void>;
  createAnswers: (data: TCreateAnswer[], force?: boolean) => Promise<void>;
  getAnswers: (questionId: string) => Promise<void>;
  updateAnswer: (data: Partial<TAnswer>, questionId: string) => Promise<void>;
  deleteAnswer: (id: string, questionId: string) => Promise<void>;
  deleteAllAnswers: (examId: string) => Promise<void>;
  clearError: () => void;
}

export const useAnswerStore = create<AnswerState>((set, get) => ({
  answers: {},
  isLoading: false,
  error: null,
  createAnswer: async (data) => {
    set({
      isLoading: true,
    });
    const r = await answerService.create(data);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const answers = get().answers;
    answers[data.questionId]?.push(r.data!);
    set({
      answers,
      isLoading: false,
    });
  },
  createAnswers: async (data, force) => {
    set({
      isLoading: true,
    });
    const r = await answerService.createMany(data);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    let newAnswers = {};
    if (!force) {
      newAnswers = d;
    } else {
      const answers = get().answers;
      answers[d[0].questionId]?.push(...d);
      newAnswers = answers;
    }
    set({
      answers: newAnswers,
      isLoading: false,
    });
  },
  getAnswers: async (questionId) => {
    set({
      isLoading: true,
    });
    const r = await answerService.getAnswers(questionId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const answers = get().answers;
    answers[questionId] = r.data!;
  
    set({
      answers,
      isLoading: false,
    });
  },
  updateAnswer: async (data, questionId) => {
    set({
      isLoading: true,
    });
    const r = await answerService.update(data);
    const answers = get().answers;
    const d = answers[questionId]?.map((r2) => {
      let data = r2;
      if (r2.id === r.data!.id) {
        data = r.data!;
      }
      return data;
    });
    answers[questionId] = d;
    console.log(answers);

    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    set({
      isLoading: false,
      answers,
    });
  },
  deleteAnswer: async (id, questionId) => {
    set({
      isLoading: true,
    });
    const r = await answerService.delete(id);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const answers = get().answers;

    answers[questionId] = answers[questionId]?.filter((a) => a.id !== id);
    set({
      isLoading: false,
      answers,
    });
  },
  deleteAllAnswers: async (examId) => {
    set({
      isLoading: true,
    });
    const r = await answerService.deleteAll(examId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    set({
      isLoading: false,
      answers: {},
    });
  },
  clearError: () => {
    set({ error: null });
  },
}));
