import { AuthService } from "./authService";
import { AxiosService, ResponseList, TBaseResponseData } from "./axiosService";

enum SubjectQuestionType {
  MultipleChoice = "MultipleChoice",
  Essay = "Essay",
}
export type TSubjectQuestionType = keyof typeof SubjectQuestionType;
export type TSubjectQuestion = {
  content: string;
  subjectId: string;
  type: TSubjectQuestionType;
  idx: number
} & TBaseResponseData;

export type TCreateSubjectQuestion = Omit<
  TSubjectQuestion,
  keyof TBaseResponseData
>;

class SubjectQuestionService {
  private static instance: SubjectQuestionService;
  private api: AxiosService;

  private constructor() {
    AuthService.init();
    this.api = AxiosService.init();
  }

  static init(): SubjectQuestionService {
    if (!SubjectQuestionService.instance) {
      SubjectQuestionService.instance = new SubjectQuestionService();
    }
    return SubjectQuestionService.instance;
  }

  create = async (data: TCreateSubjectQuestion) => {
    const r = await this.api.post<TSubjectQuestion>(
      "/subject-question/create",
      data
    );
    return r;
  };

  createMany = async (data: TCreateSubjectQuestion[]) => {
    const r = await this.api.post<TSubjectQuestion[]>(
      "/subject-question/create-many",
      {
        data,
      }
    );
    return r;
  };

  getSubjectQuestions = async (
    subjectId: string,
    page: number,
    limit: number
  ) => {
    const r = await this.api.get<ResponseList<TSubjectQuestion>>(
      "/subject-question/gets",
      {
        subjectId,
        page,
        limit,
      }
    );
    return r;
  };

  deleteAll = async (subjectId: string) => {
    const r = await this.api.post<{}>("/subject-question/delete-all", {
      subjectId,
    });
    return r;
  };
}

export const subjectQuestionService = SubjectQuestionService.init();
