import { create } from "zustand";
import { examService, TCreateExam, TExam } from "@/services/examService";
type Undefined<T> = T | undefined;

interface ExamState {
  exams: Map<string, TExam>;
  isLoading: boolean;
  error: string | null;

  createExam: (data: TCreateExam) => Promise<Undefined<TExam>>;
  updateExam: (id: string, data: Partial<Omit<TExam, "id">>) => Promise<void>;
  getExams: () => Promise<void>;
  detailExam: (id: string) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
  exams: new Map(),
  isLoading: false,
  error: null,
  createExam: async (data: TCreateExam) => {
    set({
      isLoading: true,
    });
    const r = await examService.create(data);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const exams = get().exams;
    exams.set(d.id!, d);
    set({
      isLoading: false,
      exams,
    });
    return d;
  },
  getExams: async () => {
    set({
      isLoading: true,
    });
    const r = await examService.getExams();
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const exams = new Map();
    d.forEach((exm) => {
      exams.set(exm.id, exm);
    });
    set({
      exams,
      isLoading: false,
    });
  },
  updateExam: async (id, data) => {
    set({
      isLoading: true,
    });
    const r = await examService.update({ ...data, id });
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const exams = get().exams;
    exams.set(id, r.data!);
    set({
      isLoading: false,
      exams,
    });
  },
  detailExam: async (id) => {
    set({
      isLoading: true,
    });
    const r = await examService.getExam(id);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const exams = get().exams;
    exams.set(d.id!, d);
    set({
      isLoading: false,
      exams,
    });
  },
  deleteExam: async (id: string) => {
    set({
      isLoading: true,
    });
    const r = await examService.delete(id);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const exams = get().exams;
    exams.delete(id);
    set({
      isLoading: false,
      exams,
    });
  },
  clearError: () => {
    set({ error: null });
  },
}));
