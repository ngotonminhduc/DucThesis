import { Answer } from "../models/Answer.js";
import { Question } from "../models/Question.js";
import { checkExamActive } from "../utils/checkExam.js";

export const createAnswer = async (req, res) => {
  const { examId, questionId, content, isCorrect } = req.body;

  if (!questionId && !content && !isCorrect) {
    throw new Error("Invalid Params");
  }
  // const check = checkExamActive(examId);
  // if (check) {
  //   throw new Error("Can not create answer!");
  // }

  const existQuestion = await Question.findOne({
    where: { id: questionId },
  }).then((r) => r?.toJSON());
  if (!existQuestion) {
    throw new Error("Question does not exist!");
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

export const updateAnswer = async (req, res) => {
  const { id, content, isCorrect } = req.body;

  if (!id && !content && !isCorrect) {
    throw new Error("Invalid Params");
  }

  const existAnswer = await Answer.findOne({ where: { id } }).then((r) =>
    r?.toJSON()
  );

  // const check = checkExamActive(existAnswer.examId);
  // if (check) {
  //   throw new Error("Can not update answer!");
  // }

  await Answer.update({ content, isCorrect }, { where: { id } }).then(
    (r) => r[0]
  );

  res.status(200).json({
    success: true,
    data: {},
  });
};

export const getAnswers = async (req, res) => {
  const { examId } = req.query;

  if (!examId) {
    throw new Error("Invalid Params");
  }
  const answers = await Answer.findAll({ where: { examId } }).then(
    (arr) => arr.map((r) => r.toJSON())
  );

  res.status(200).json({
    success: true,
    data: {
      answers,
    },
  });
};


export const deleteAnswer = async (req, res) => {
  const { examId } = req.body;

  if (!examId) {
    throw new Error("Invalid Params");
  }

  const existAnswer = await Answer.findOne({ where: { examId } }).then((r) =>
    r?.toJSON()
  );

  if (!existAnswer) {
    throw new Error("Can not delete answer!");
  }

  await Answer.destroy({ where: { examId } });

  res.status(200).json({
    success: true,
    data: {},
  });
};
