import { AuthService } from "./authService";
import { AxiosService, TBaseResponseData } from "./axiosService";

export type TTag = {
  examId: string;
  code: string;
  weight: number;
  mixQuestions: number[];
} & TBaseResponseData;

class TagService {
  private static instance: TagService;
  private api: AxiosService;

  private constructor() {
    AuthService.init();
    this.api = AxiosService.init();
  }

  static init(): TagService {
    if (!TagService.instance) {
      TagService.instance = new TagService();
    }
    return TagService.instance;
  }

  createTags = async (data: { examId: string }) => {
    const r = await this.api.post<TTag[]>("/tag/bulk-create", data);
    return r;
  };

  getRandomTag = async (examId: string) => {
    const r = await this.api.post<TTag>("/tag/get-random", {
      examId,
    });
    return r;
  };

  deleteAll = (examId: string) => {
    return this.api.post<{}>("/tag/delete-all", { examId });
  };
}

export const tagService = TagService.init();
