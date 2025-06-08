import { TCreateSubjectAnswer } from "@/services/subjectAnswerService";
import { TCreateSubjectQuestion } from "@/services/subjectQuestionService";

type ChangeStateItemReason = "add" | "update" | "delete";
type ChangeStateItemData = {
  add: never;
  update: never;
  delete: {
    key: string;
  };
};

export type AddItemHandler = (question: TStateSubjectQuestion) => void;
export type RemoveItemHandler = (key: string) => void;
export type UpdateItemHandler = (key: string, question: TStateSubjectQuestion) => void;
export type AnswerChangeHandler = (
  incrementId: number,
  answerId: string
) => void;
export type ChangeStateHandler = <
  R extends ChangeStateItemReason,
  D extends ChangeStateItemData[R]
>(
  reason: R,
  data?: D
) => void;

export type TStateSubjectAnswer = TCreateSubjectAnswer & {
  id?: string;
  canUpdate?: boolean;
};

export type TStateSubjectQuestion = TCreateSubjectQuestion & {
  answers?: TStateSubjectAnswer[];
  id?: string;
  canUpdate?: boolean;
};
