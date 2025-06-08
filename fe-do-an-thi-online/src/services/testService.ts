import { AuthService } from "./authService";
import { AxiosService, TBaseResponseData } from "./axiosService";
import { TExam } from "./examService";

enum TestStatus {
  TakingATest = "TakingATest",
  TookTheTest = "TookTheTest",
  Normal = "Normal",
  Locked = "Locked",
}

export type TAnswerMap = {
  [k: string]: string[];
};

export type TTestStatus = keyof typeof TestStatus;

export type TTest = {
  examId: string;
  userId: string;
  score: number;
  status: TTestStatus;
  code: string
  answersMap?: TAnswerMap;
  correctAnswersMap?: TAnswerMap;
  correctAnswersCount: number;
  startAt: Date;
  finalAt: Date;
  exam?: TExam;
} & TBaseResponseData;

class TestService {
  private static instance: TestService;
  private api: AxiosService;

  private constructor() {
    AuthService.init();
    this.api = AxiosService.init();
  }

  static init(): TestService {
    if (!TestService.instance) {
      TestService.instance = new TestService();
    }
    return TestService.instance;
  }

  create = async (examId: string) => {
    const r = await this.api.post<TTest>("/test/create", { examId });
    return r;
  };

  getTests = async () => {
    const r = await this.api.get<TTest[]>("/test/gets");
    return r;
  };

  getTest = async (id: string) => {
    const r = await this.api.get<TTest>("/test/get", {
      id,
    });
    return r;
  };

  activeTest = async (examId: string) => {
    const r = await this.api.post<TTest>("/test/active", {
      examId,
      startAt: Date.now()
    });
    return r;
  };

  caculateScore = async (id: string, answersMap: TAnswerMap) => {
    const r = await this.api.post<TTest>("/test/calc-score", {
      id,
      answers: answersMap,
      finalAt: Date.now()
    });
    return r;
  };

  delete = async (id: string) => {
    const r = await this.api.post<{}>("/test/delete", { id });
    return r;
  };
}

export const testService = TestService.init();
