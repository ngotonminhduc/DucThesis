import { AuthService } from "./authService";
import { AxiosService, TBaseResponseData } from "./axiosService";

enum QuestionType {
  MultipleChoice = "MultipleChoice",
  Essay = "Essay",
}
export type TQuestionType = keyof typeof QuestionType;
export type TQuestion = {
  content: string;
  examId: string;
  type: TQuestionType;
  idx: number
  subjectQuestionId: string
} & TBaseResponseData;

export type TCreateQuestion = Omit<TQuestion, keyof TBaseResponseData>;

class QuestionService {
  private static instance: QuestionService;
  private api: AxiosService;

  private constructor() {
    AuthService.init();
    this.api = AxiosService.init();
  }

  static init(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  create = async (data: TCreateQuestion) => {
    const r = await this.api.post<TQuestion>("/question/create", data);
    return r;
  };

  createMany = async (data: TCreateQuestion[]) => {
    const r = await this.api.post<TQuestion[]>("/question/create-many", {data});
    return r;
  };

  getQuestions = async (examId: string) => {
    const r = await this.api.get<TQuestion[]>("/question/gets", {
      examId,
    });
    return r;
  };

  update = async (data: Partial<TQuestion>) => {
    const r = await this.api.post<{}>("/question/update", data);
    return r;
  };

  delete = async (id: string) => {
    const r = await this.api.post<{}>("/question/delete", { id });
    return r;
  };

  deleteAll = async (examId: string) => {
    const r = await this.api.post<{}>("/question/delete-all", { examId });
    return r;
  };
}

export const questionService = QuestionService.init();
