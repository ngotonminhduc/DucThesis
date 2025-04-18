import { create } from "zustand";
import { testService, TTest } from "@/services/testService";

interface ExamState {
  tests: Map<string, TTest>;
  isLoading: boolean;
  error: string | null;
  activeTest: TTest | null;
  createTest: (examId: string) => Promise<boolean>;
  getTests: () => Promise<void>;
  detailTest: (id: string) => Promise<void>;
  startTest: (examId: string) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
  caculateTestScore: (
    id: string,
    answersMap: Required<TTest>["answersMap"]
  ) => Promise<boolean>;
  clearError: () => void;
}

export const useTestStore = create<ExamState>((set, get) => ({
  tests: new Map(),
  isLoading: false,
  error: null,
  activeTest: null,
  createTest: async (examId) => {
    set({
      isLoading: true,
    });
    const r = await testService.create(examId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return false;
    }
    const d = r.data!;
    const tests = get().tests;
    tests.set(d.id!, d);
    set({
      isLoading: false,
      tests,
    });
    return true;
  },
  startTest: async (examId) => {
    set({
      isLoading: true,
    });
    const r = await testService.activeTest(examId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const tests = get().tests;
    tests.set(d.id, d);
    set({
      isLoading: false,
      tests,
      activeTest: d,
    });
  },
  caculateTestScore: async (id, answersMap) => {
    set({
      isLoading: true,
    });
    const r = await testService.caculateScore(id, answersMap);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return false;
    }
    const d = r.data!;
    const tests = get().tests;
    tests.set(d.id, d);
    set({
      isLoading: false,
      tests,
      activeTest: null,
    });
    return true;
  },
  getTests: async () => {
    set({
      isLoading: true,
    });
    const r = await testService.getTests();
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const tests = new Map();
    d.forEach((exm) => {
      tests.set(exm.id, exm);
    });
    set({
      tests,
      isLoading: false,
    });
  },
  detailTest: async (id) => {
    set({
      isLoading: true,
    });
    const r = await testService.getTest(id);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const d = r.data!;
    const tests = get().tests;
    tests.set(d.id!, d);
    set({
      isLoading: false,
      tests,
    });
  },
  deleteTest: async (id: string) => {
    set({
      isLoading: true,
    });
    const r = await testService.delete(id);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    const tests = get().tests;
    tests.delete(id);
    set({
      isLoading: false,
      tests,
    });
  },
  clearError: () => {
    set({ error: null });
  },
}));
