import { AuthService } from "./authService";
import { AxiosService, TBaseResponseData } from "./axiosService";

export type TSubject = {
  title: string;
  description: string;
} & TBaseResponseData;

class SubjectService {
  private static instance: SubjectService;
  private api: AxiosService;

  private constructor() {
    AuthService.init();
    this.api = AxiosService.init();
  }

  static init(): SubjectService {
    if (!SubjectService.instance) {
      SubjectService.instance = new SubjectService();
    }
    return SubjectService.instance;
  }

  getSubjects = async () => {
    const r = await this.api.get<TSubject[]>("/subject/gets");
    return r;
  };

  getSubject = async (id: string) => {
    const r = await this.api.get<TSubject>("/subject/get", {
      id,
    });
    return r;
  };
}

export const subjectService = SubjectService.init();
