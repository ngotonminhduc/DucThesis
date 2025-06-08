import { AxiosService, TBaseResponseData } from "./axiosService";

export type TAnswer = {
  examId: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  idx: number;
  subjectAnswerId: string;
} & TBaseResponseData;

export type TCreateAnswer = Omit<TAnswer, keyof TBaseResponseData>;

class AnswerService {
  private static instance: AnswerService;
  private api: AxiosService;

  private constructor() {
    this.api = AxiosService.init();
  }

  static init(): AnswerService {
    if (!AnswerService.instance) {
      AnswerService.instance = new AnswerService();
    }
    return AnswerService.instance;
  }

  create = async (data: TCreateAnswer) => {
    const r = await this.api.post<TAnswer>("/answer/create", data);
    return r;
  };

  createMany = async (data: TCreateAnswer[]) => {
    const r = await this.api.post<TAnswer[]>("/answer/create-many", { data });
    return r;
  };

  getAnswers = async (questionId: string) => {
    const r = await this.api.get<TAnswer[]>("/answer/gets", {
      questionId,
    });
    return r;
  };

  update = async (data: Partial<TAnswer>) => {
    const r = await this.api.post<TAnswer>("/answer/update", data);
    return r;
  };

  delete = async (id: string) => {
    const r = await this.api.post<{}>("/answer/delete-all", { id });
    return r;
  };

  deleteAll = async (examId: string) => {
    const r = await this.api.post<{}>("/answer/delete-all", { examId });
    return r;
  };
}

export const answerService = AnswerService.init();
