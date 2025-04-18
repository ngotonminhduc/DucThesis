import { Answer } from "../models/Answer.js";
import { Question } from "../models/Question.js";
import { QuesType } from "../utils/type.js";

export const createAnswer = async (req, res) => {
  const { examId, questionId, content, isCorrect } = req.body;

  if (!questionId || !content) {
    throw new Error("Tham số không hợp lệ");
  }

  const existQuestion = await Question.findOne({
    where: { id: questionId },
  }).then((r) => r?.toJSON());

  if (!existQuestion) {
    throw new Error("Câu hỏi không tồn tại!");
  }

  if (existQuestion.type === QuesType.Essay) {
    const existAnswer = await Answer.findOne({
      where: { id: questionId },
    }).then((r) => r?.toJSON());
    if (existAnswer) {
      throw new Error("Chỉ được tạo một câu trả lời cho câu hỏi tự luận");
    }
  }

  const ques = await Answer.create({
    examId,
    questionId,
    content,
    isCorrect,
  }).then((r) => r.toJSON());

  res.status(200).json({
    success: true,
    data: {
      ...ques,
    },
  });
};

export const createAnswers = async (req, res) => {
  const { data } = req.body;

  if (!data || (typeof data !== "object" && !Array.from(data).length)) {
    throw new Error("Tham số không hợp lệ");
  }

  const questionId = data[0]?.["questionId"];
  if (!questionId) {
    throw new Error("Cần truyền questionId");
  }

  const existQuestion = await Question.findOne({
    where: { id: questionId },
  }).then((r) => r?.toJSON());

  if (!existQuestion) {
    throw new Error("Câu hỏi không tồn tại!");
  }

  if (existQuestion.type === QuesType.Essay) {
    throw new Error("Câu hỏi tự luận không cần tạo câu trả lời");
  }

  const ques = await Answer.bulkCreate(data).then((arr) =>
    arr.map((r) => r?.toJSON())
  );

  res.status(200).json({
    success: true,
    data: ques,
  });
};

export const updateAnswer = async (req, res) => {
  const { id, content, isCorrect } = req.body;

  if (!id && !content && !isCorrect) {
    throw new Error("Tham số không hợp lệ");
  }

  await Answer.update({ content, isCorrect }, { where: { id } }).then(
    (r) => r[0]
  );
  const r = await Answer.findOne({ where: { id } }).then((r) => r?.toJSON());
  res.status(200).json({
    success: true,
    data: { ...r },
  });
};

export const getAnswers = async (req, res) => {
  const { questionId } = req.query;

  if (!questionId) {
    throw new Error("Tham số không hợp lệ");
  }
  
  const answers = await Answer.findAll({
    where: { questionId },
    order: [["idx", "asc"]],
  }).then((arr) => arr.map((r) => r.toJSON()));

  res.status(200).json({
    success: true,
    data: answers,
  });
};

export const deleteAnswer = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new Error("Tham số không hợp lệ");
  }
  await Answer.destroy({ where: { id } });

  res.status(200).json({
    success: true,
    data: {},
  });
};

export const deleteAllAnswers = async (req, res) => {
  const { examId } = req.body;

  if (!examId || typeof examId !== "string") {
    throw new Error("Tham số không hợp lệ");
  }
  await Answer.destroy({ where: { examId } });

  res.status(200).json({
    success: true,
    data: {},
  });
};
