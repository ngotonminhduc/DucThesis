import { AxiosService, ResponseList, TBaseResponseData } from "./axiosService";

export type TSubjectAnswer = {
  subjectId: string;
  subjectQuestionId: string;
  content: string;
  isCorrect: boolean;
  idx: number
} & TBaseResponseData;

export type TCreateSubjectAnswer = Omit<
  TSubjectAnswer,
  keyof TBaseResponseData
>;

class SubjectAnswerService {
  private static instance: SubjectAnswerService;
  private api: AxiosService;

  private constructor() {
    this.api = AxiosService.init();
  }

  static init(): SubjectAnswerService {
    if (!SubjectAnswerService.instance) {
      SubjectAnswerService.instance = new SubjectAnswerService();
    }
    return SubjectAnswerService.instance;
  }

  createMany = async (data: TCreateSubjectAnswer[]) => {
    const r = await this.api.post<TSubjectAnswer[]>(
      "/subject-answer/create-many",
      {
        data,
      }
    );
    return r;
  };

  getSubjectAnswers = (subjectQuestionId: string) => {
    return this.api.get<ResponseList<TSubjectAnswer>>("/subject-answer/gets", {
      subjectQuestionId,
    });
  };

  deleteAll = (subjectId: string) => {
    return this.api.post<{}>("/subject-answer/delete-all", { subjectId });
  };
}

export const subjectAnswerService = SubjectAnswerService.init();
