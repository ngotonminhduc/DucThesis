import { create } from "zustand";
import {
  questionService,
  TCreateQuestion,
  TQuestion,
} from "@/services/questionService";

interface QuestionState {
  questions: { [k in string]-?: TQuestion[] };
  isLoading: boolean;
  error: string | null;
  createQuestion: (data: TCreateQuestion) => Promise<TQuestion | undefined>;

  createQuestions: (
    data: TCreateQuestion[],
    force?: boolean
  ) => Promise<TQuestion[] | undefined>;
  updateQuestion: (data: Partial<TQuestion>) => Promise<void>;
  getQuestions: (examId: string) => Promise<void>;
  deleteAllQuestions: (examId: string) => Promise<void>;
  clearError: () => void;
  clearStore: () => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: {},
  isLoading: false,
  error: null,
  createQuestion: async (data: TCreateQuestion) => {
    set({
      isLoading: true,
      error: null,
    });
    const r = await questionService.create(data);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const questions = get().questions;
    questions[data.examId]
      ? questions[data.examId]?.push(d)
      : (questions[data.examId] = [d]);
    set({
      questions,
      isLoading: false,
    });
    return r.data;
  },
  createQuestions: async (data: TCreateQuestion[]) => {
    set({
      isLoading: true,
      error: null,
    });
    const r = await questionService.createMany(data);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const questions = get().questions;
    questions[data[0].examId] = d;
    set({
      questions,
      isLoading: false,
    });
    return r.data;
  },
  getQuestions: async (examId) => {
    set({
      isLoading: true,
      error: null,
    });
    const r = await questionService.getQuestions(examId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const questions = get().questions;
    questions[examId] = r.data!
    set({
      questions,
      isLoading: false,
    });
  },
  updateQuestion: async (data) => {
    set({
      isLoading: true,
      error: null,
    });
    const r = await questionService.update(data);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    set({
      isLoading: false,
    });
  },
  deleteAllQuestions: async (examId: string) => {
    set({
      isLoading: true,
      error: null,
    });
    const r = await questionService.deleteAll(examId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    set({
      isLoading: false,
      questions: {},
    });
  },
  clearError: () => {
    set({ error: null });
  },
  clearStore: () => {
    set({
      questions: {},
      isLoading: false,
      error: null,
    });
  },
}));
