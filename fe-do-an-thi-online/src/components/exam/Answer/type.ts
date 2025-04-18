import { TCreateAnswer } from "@/services/answerService";

export type TStateAnswer = TCreateAnswer & { id?: string; canUpdate?: boolean };
export type AddItemHandler = (item: TStateAnswer) => void;
export type SelectChangeItemHandler = (key: number) => void;
export type UpdateItemHandler = (key: number, answer: TStateAnswer) => void;
export type RemoveItemHandler = SelectChangeItemHandler