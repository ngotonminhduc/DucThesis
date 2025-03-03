import { Test } from "../models/Test.js";
import express from "express";
import { calcScore } from "../utils/calcScore.js";
import { getAuthUser } from "../utils/getAuthUser.js";
import { mappingCorrectAnswers } from "../utils/mappingAnswer.js";
import { Exam } from "../models/Exam.js";
import { StatusTest } from "../utils/type.js";

export const createTest = async (req, res) => {
  const { examId } = req.body;
  if (!examId) {
    throw new Error("Invalid Params");
  }
  const existExam = await Exam.findOne({ where: { id: examId } }).then((r) =>
    r ? true : false
  );
  if (!existExam) {
    throw new Error("Invalid Exam");
  }
  const u = getAuthUser(req);
  const correctAnswersMap = mappingCorrectAnswers(examId);
  const t = await Test.create({
    examId,
    userId: u.id,
    correctAnswersMap,
  }).then((r) => r.toJSON());
  //Exclude correctAnswersMap
  const { correctAnswersMap: m, ...t2 } = t;
  res.status(200).json({
    success: true,
    data: {
      ...t2,
    },
  });
};

export const getTests = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new Error("Invalid Params");
  }
  const tests = await Test.findAll({ where: { id } }).then((arr) =>
    arr.map((r) => r.toJSON())
  );

  res.status(200).json({
    success: true,
    data: {
      tests,
    },
  });
};

export const deleteTest = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new Error("Invalid Params");
  }

  const existTest = await Test.findOne({ where: { id } }).then((r) =>
    r?.toJSON()
  );

  if (!existTest) {
    throw new Error("Can not delete Test!");
  }

  await Test.destroy({ where: { id } });

  res.status(200).json({
    success: true,
    data: {},
  });
};

/** @type {express.RequestHandler} */
export const submitTest = async (req, res) => {
  const { id, answers } = req.body;
  if (!id && !answers && typeof answers !== "object") {
    throw Error("Invalid params");
  }
  const t = await Test.findOne({ where: { id } }).then((r) => r?.toJSON());
  const u = getAuthUser(req);
  const isTestOwner = t.userId === u.id;
  if (!t || !isTestOwner) {
    throw new Error("User not have permission");
  }
  //caculate score and update
  const score = calcScore(answers, t.correctAnswersMap);
  await Test.update(
    {
      score,
      status: StatusTest.Locked
    },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({
    success: true,
    data: {
      score,
    },
  });
};
