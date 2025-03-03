import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";
import { checkExamActive } from "../utils/checkExam.js";

export const createQuestion = async (req, res) => {
  const { examId, content } = req.body;

  if (!examId && !content) {
    throw new Error("Invalid Params");
  }

  const existExam = await Exam.findOne({ where: { id: examId } }).then((r) =>
    r?.toJSON()
  );
  if (!existExam) {
    throw new Error("Exam does not exist!");
  }

  const ques = await Question.create({
    examId,
    content,
  }).then((r) => r.toJSON());

  res.status(200).json({
    success: true,
    data: {
      ...ques,
    },
  });
};

export const getQuestions = async (req, res) => {
  const { examId } = req.query;

  if (!examId) {
    throw new Error("Invalid Params");
  }
  const questions = await Question.findAll({ where: { examId } }).then(
    (arr) => arr.map((r) => r.toJSON())
  );

  res.status(200).json({
    success: true,
    data: {
      questions,
    },
  });
};


export const updateQuestion = async (req, res) => {
  const { id, content } = req.body;

  if (!id && !content) {
    throw new Error("Invalid Params");
  }
  const existQuestion = await Question.findOne({ where: { id } }).then((r) =>
    r?.toJSON()
  );
  // const check = await checkExamActive(existQuestion.examId);
  // if (check) {
  //   throw new Error("Can not update question!");
  // }

  await Question.update({ content }, { where: { id } }).then((r) => r[0]);
  res.status(200).json({
    success: true,
    data: {},
  });
};

export const deleteQuestion = async (req, res) => {
  const { examId } = req.body;

  if (!examId) {
    throw new Error("Invalid Params");
  }

  const existQuestion = await Question.findOne({ where: { examId } }).then((r) =>
    r?.toJSON()
  );

  if (!existQuestion) {
    throw new Error("Can not delete question!");
  }

  await Question.destroy({ where: { examId } });

  res.status(200).json({
    success: true,
    data: {},
  });
};
