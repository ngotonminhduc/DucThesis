import { create } from "zustand";
import {
  subjectAnswerService,
  TCreateSubjectAnswer,
  TSubjectAnswer,
} from "@/services/subjectAnswerService";

interface SubjectAnswerState {
  subjectAnswers: { [k in string]-?: TSubjectAnswer[] };
  isLoading: boolean;
  error: string | null;

  createSubjectAnswers: (
    data: TCreateSubjectAnswer[],
    force?: boolean
  ) => Promise<void>;
  getSubjectAnswers: (subjectQuestionId: string) => Promise<void>;
  deleteAllSubjectAnswers: (subjectId: string) => Promise<void>;
  clearError: () => void;
}

export const useSubjectAnswerStore = create<SubjectAnswerState>((set, get) => ({
  subjectAnswers: {},
  isLoading: false,
  error: null,
  createSubjectAnswers: async (data, force) => {
    set({
      isLoading: true,
    });
    const r = await subjectAnswerService.createMany(data);
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
      const answers = get().subjectAnswers;
      answers[d[0].subjectQuestionId]?.push(...d);
      newAnswers = answers;
    }
    set({
      subjectAnswers: newAnswers,
      isLoading: false,
    });
  },
  getSubjectAnswers: async (subjectQuestionId) => {
    set({
      isLoading: true,
    });
    const r = await subjectAnswerService.getSubjectAnswers(subjectQuestionId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const subjectAnswers = get().subjectAnswers;
    subjectAnswers[subjectQuestionId] = r.data!.items;

    set({
      subjectAnswers,
      isLoading: false,
    });
  },
  deleteAllSubjectAnswers: async (subjectId) => {
    set({
      isLoading: true,
    });
    const r = await subjectAnswerService.deleteAll(subjectId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    set({
      isLoading: false,
      subjectAnswers: {},
    });
  },
  clearError: () => {
    set({ error: null });
  },
}));
