import { TCreateQuestion, TQuestionType } from "@/services/questionService";
import { TStateAnswer } from "../Answer/type";

export type TStateQuestion = TCreateQuestion & {
  answers?: TStateAnswer[];
  id?: string;
  page?: number
  canUpdate?: boolean;
};

type ChangeStateItemReason = "add" | "update" | "delete";
type ChangeStateItemData = {
  add: never;
  update: never;
  delete: {
    key: number;
  };
};

export type ChangeStateHandler = <
  R extends ChangeStateItemReason,
  D extends ChangeStateItemData[R]
>(
  reason: R,
  data?: D
) => void;

export type AddItemHandler = (question: TStateQuestion) => void;
export type RemoveItemHandler = (key: number) => void;
export type UpdateItemHandler = (key: number, question: TStateQuestion) => void;
export type AnswerChangeHandler = (
  incrementId: number,
  answerId: string
) => void;
