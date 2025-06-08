import { tagService, TTag } from "@/services/tagService";
import { create } from "zustand";

interface TagState {
  tags: Map<string, TTag>;
  isLoading: boolean;
  error: string | null;
  selectedTag: TTag | null;
  createTags: (examId: string) => Promise<void>;
  getRandomTag: (examId: string) => Promise<void>;
  deleteAllTags: (examId: string) => Promise<void>;
  clearError: () => void;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: new Map(),
  isLoading: false,
  error: null,
  selectedTag: null,
  createTags: async (examId) => {
    set({ isLoading: true });
    const r = await tagService.createTags({
      examId,
    });
    if (r.message) {
      set({ isLoading: false, error: r.message });
      return;
    }
    const tags = new Map(r.data?.map((tag) => [tag.id, tag]));
    set({ tags, isLoading: false });
  },
  getRandomTag: async (id) => {
    set({ isLoading: true });
    const r = await tagService.getRandomTag(id);
    if (r.message) {
      set({ isLoading: false, error: r.message });
      return;
    }
    set({ selectedTag: r.data!, isLoading: false });
  },
  deleteAllTags: async (examId) => {
    set({
      isLoading: true,
    });
    const r = await tagService.deleteAll(examId);
    if (r.message) {
      set({
        isLoading: false,
        error: r.message,
      });
      return;
    }
    set({
      isLoading: false,
      tags: new Map(),
    });
  },
  clearError: () => set({ error: null }),
}));
