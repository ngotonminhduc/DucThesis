import { create } from "zustand";
import {
  subjectQuestionService,
  TCreateSubjectQuestion,
  TSubjectQuestion,
} from "@/services/subjectQuestionService";

interface SubjectQuestionState {
  subjectQuestions: { [k in string]-?: TSubjectQuestion[] };
  totalCount: number
  isLoading: boolean;
  error: string | null;
  createSubjectQuestion: (
    data: TCreateSubjectQuestion
  ) => Promise<TSubjectQuestion | undefined>;
  createSubjectQuestions: (
    data: TCreateSubjectQuestion[],
    force?: boolean
  ) => Promise<TSubjectQuestion[] | undefined>;
  getSubjectQuestions: (
    subjectId: string,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  deleteAllSubjectQuestions: (subjectId: string) => Promise<void>;
  clearError: () => void;
  clearStore: () => void;
}

export const useSubjectQuestionStore = create<SubjectQuestionState>(
  (set, get) => ({
    subjectQuestions: {},
    isLoading: false,
    totalCount: 0,
    error: null,
    createSubjectQuestion: async (data) => {
      set({
        isLoading: true,
        error: null,
      });
      const r = await subjectQuestionService.create(data);
      if (r.message) {
        set({
          isLoading: false,
          error: r.message,
        });
        return;
      }
      const d = r.data!;
      const subjectQuestions = get().subjectQuestions;
      subjectQuestions[data.subjectId]
        ? subjectQuestions[data.subjectId]?.push(d)
        : (subjectQuestions[data.subjectId] = [d]);
      set({
        subjectQuestions,
        isLoading: false,
      });
      return r.data;
    },
    createSubjectQuestions: async (data) => {
      set({
        isLoading: true,
        error: null,
      });
      const r = await subjectQuestionService.createMany(data);
      if (r.message) {
        set({
          isLoading: false,
          error: r.message,
        });
        return;
      }
      const d = r.data!;
      const subjectQuestions = get().subjectQuestions;
      subjectQuestions[data[0].subjectId] = d;
      set({
        subjectQuestions,
        isLoading: false,
      });
      return r.data;
    },
    // Trong hàm getSubjectQuestions
    getSubjectQuestions: async (subjectId, page = 1, pageSize = 100) => {
      set({ isLoading: true });
      const r = await subjectQuestionService.getSubjectQuestions(
        subjectId,
        page,
        pageSize
      );
      if (r.message) {
        set({ isLoading: false, error: r.message });
        return;
      }

      set((state) => ({
        subjectQuestions: {
          ...state.subjectQuestions,
          [subjectId]: r.data!.items,
        },
        totalCount: r.data!.totalCount,
        isLoading: false,
      }));
    },
    deleteAllSubjectQuestions: async (subjectId) => {
      set({
        isLoading: true,
        error: null,
      });
      const r = await subjectQuestionService.deleteAll(subjectId);
      if (r.message) {
        set({
          isLoading: false,
          error: r.message,
        });
        return;
      }
      set({
        isLoading: false,
        subjectQuestions: {},
      });
    },
    clearError: () => {
      set({ error: null });
    },
    clearStore: () => {
      set({
        subjectQuestions: {},
        isLoading: false,
        error: null,
      });
    },
  })
);
