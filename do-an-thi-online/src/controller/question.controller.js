import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

export const createQuestion = async (req, res) => {
  const { examId, content, type, idx, subjectQuestionId } = req.body;

  if (!examId || !content || !type || !subjectQuestionId) {
    throw new Error("Tham số không hợp lệ");
  }

  const existExam = await Exam.findOne({ where: { id: examId } }).then((r) =>
    r?.toJSON()
  );
  if (!existExam) {
    throw new Error("Bài kiểm tra không tồn tại!");
  }

  const ques = await Question.create({
    examId,
    content,
    type,
    subjectQuestionId,
    idx,
  }).then((r) => r.toJSON());

  res.status(200).json({
    success: true,
    data: {
      ...ques,
    },
  });
};

export const createQuestions = async (req, res) => {
  const { data } = req.body;

  if (typeof data !== "object" && !Array.from(data).length) {
    throw new Error("Tham số không hợp lệ");
  }

  const examId = data[0]?.["examId"];
  if (!examId) {
    throw new Error("Cần truyền examId");
  }

  const existExam = await Exam.findOne({ where: { id: examId } }).then((r) =>
    r?.toJSON()
  );
  if (!existExam) {
    throw new Error("Bài kiểm tra không tồn tại!");
  }

  const ques = await Question.bulkCreate(data, {
    ignoreDuplicates: true,
  }).then((r) => r.map((d) => d?.toJSON()));

  res.status(200).json({
    success: true,
    data: ques,
  });
};

export const getQuestions = async (req, res) => {
  const { examId } = req.query;

  if (!examId) {
    throw new Error("Tham số không hợp lệ");
  }
  const questions = await Question.findAll({
    where: { examId },
    order: [["createdAt", "asc"]],
  }).then((arr) => arr.map((r) => r.toJSON()));

  res.status(200).json({
    success: true,
    data: questions,
  });
};

export const updateQuestion = async (req, res) => {
  const { id, content, type } = req.body;

  if (!id && !content && !type) {
    throw new Error("Tham số không hợp lệ");
  }

  await Question.update({ content, type }, { where: { id } }).then((r) => r[0]);
  res.status(200).json({
    success: true,
    data: {},
  });
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new Error("Tham số không hợp lệ");
  }

  await Question.destroy({ where: { id } });

  res.status(200).json({
    success: true,
    data: {},
  });
};

export const deleteAllQuestions = async (req, res) => {
  const { examId } = req.body;

  if (!examId || typeof examId !== "string") {
    throw new Error("Tham số không hợp lệ");
  }

  await Question.destroy({
    where: {
      examId,
    },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
