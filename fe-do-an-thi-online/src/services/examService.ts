import { AuthService, authService } from "./authService";
import { AxiosService, TBaseResponseData } from "./axiosService";

enum ExamStatus {
  "active" = "active",
  "pending" = "pending",
  "inactive" = "inactive",
}

export type TExamStatus = keyof typeof ExamStatus;

export type TExam = {
  topic: string;
  description: string;
  status: TExamStatus;
  examTime: number;
  subjectId: string;
  tagQuantity: number;
} & TBaseResponseData;

export type TCreateExam = Omit<TExam, keyof TBaseResponseData>;

class ExamService {
  private static instance: ExamService;
  private api: AxiosService;

  private constructor() {
    AuthService.init();
    this.api = AxiosService.init();
  }

  static init(): ExamService {
    if (!ExamService.instance) {
      ExamService.instance = new ExamService();
    }
    return ExamService.instance;
  }

  create = async ({
    topic,
    status,
    description,
    examTime,
    subjectId,
  }: TCreateExam) => {
    const r = await this.api.post<TExam>("/exam/create", {
      topic,
      description,
      status,
      examTime,
      subjectId,
    });
    return r;
  };

  getExams = async () => {
    const r = await this.api.get<TExam[]>("/exam/gets");
    return r;
  };

  getExam = async (id: string) => {
    const r = await this.api.get<TExam>("/exam/get", {
      id,
    });
    return r;
  };

  update = async ({
    id,
    topic,
    description,
    examTime,
    status,
    tagQuantity
  }: Partial<TExam>) => {
    const r = await this.api.post<TExam>("/exam/update", {
      id,
      topic,
      description,
      status,
      examTime,
      tagQuantity
    });
    return r;
  };

  delete = async (id: string) => {
    const r = await this.api.post<{}>("/exam/delete", { id });
    return r;
  };
}

export const examService = ExamService.init();
