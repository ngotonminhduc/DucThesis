import { create } from "zustand";
import { subjectService, TSubject } from "@/services/subjectService";

interface SubjectState {
  subjects: Map<string, TSubject>;
  isLoading: boolean;
  error: string | null;

  getSubjects: () => Promise<void>;
  detailSubject: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  // Sửa tên store
  subjects: new Map(),
  isLoading: false,
  error: null,
  getSubjects: async () => {
    set({ isLoading: true });
    const r = await subjectService.getSubjects();
    if (r.message) {
      set({ isLoading: false, error: r.message });
      return;
    }
    const subjects = new Map(r.data?.map((subject) => [subject.id, subject]));
    set({ subjects, isLoading: false });
  },
  detailSubject: async (id) => {
    set({ isLoading: true });
    const r = await subjectService.getSubject(id);
    if (r.message) {
      set({ isLoading: false, error: r.message });
      return;
    }
    const subjects = new Map(get().subjects);
    subjects.set(r.data!.id, r.data!);
    set({ subjects, isLoading: false });
  },
  clearError: () => set({ error: null }),
}));
