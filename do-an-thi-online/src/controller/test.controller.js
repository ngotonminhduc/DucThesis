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
    throw new Error("Tham số không hợp lệ");
  }
  const existExam = await Exam.findOne({
    where: { id: examId, status: "active" },
  }).then((r) => (r ? true : false));
  if (!existExam) {
    throw new Error("Bài kiểm tra không hợp lệ");
  }
  const u = await getAuthUser(req);
  const correctAnswersMap = await mappingCorrectAnswers(examId);

  const existTest = await Test.findOne({
    where: {
      userId: u.id,
      examId,
    },
  }).then((r) => r?.toJSON());

  if (existTest) {
    res.status(200).json({
      success: true,
      data: existTest,
    });
    return;
  }

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
  const u = await getAuthUser(req);

  if (!u) {
    throw new Error("Tài khoản không tồn tại");
  }

  const tests = await Test.findAll({
    where: { userId: u.id, status: StatusTest.Locked },
  }).then((arr) => arr.map((r) => r.toJSON()));
  const r = await Promise.all(
    tests.map(async (t) => {
      const exam = await Exam.findOne({ where: { id: t.examId } }).then((d) =>
        d?.toJSON()
      );
      return {
        ...t,
        exam,
      };
    })
  );

  res.status(200).json({
    success: true,
    data: r,
  });
};

export const getTest = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new Error("Tham số không hợp lệ");
  }

  const t = await Test.findOne({
    where: { id, status: StatusTest.Locked },
    order: [["finalAt", "desc"]],
  }).then((r) => r?.toJSON());

  if (!t) {
    throw new Error("KHông tìm thấy bài thi");
  }
  const exam = await Exam.findOne({ where: { id: t.examId } }).then((r) =>
    r?.toJSON()
  );
  res.status(200).json({
    success: true,
    data: {
      ...t,
      exam,
    },
  });
};

/** @type {express.RequestHandler} */
export const activeTest = async (req, res) => {
  const { examId, startAt } = req.body;
  if (!examId || typeof examId !== "string" || !startAt) {
    throw new Error("Tham số không hợp lệ");
  }
  const u = await getAuthUser(req);
  await Test.update(
    { status: StatusTest.TakingATest, startAt: new Date(startAt) },
    { where: { examId, userId: u.id, status: StatusTest.Normal } }
  );

  const { correctAnswersMap, ...r } = await Test.findOne({
    where: { examId, userId: u.id },
  }).then((r) => r?.toJSON());
  if (!r) {
    throw new Error("Bài thi đã bị xoá");
  }
  const exam = await Exam.findOne({ where: { id: r.examId } }).then((r) =>
    r?.toJSON()
  );
  res.status(200).json({
    success: true,
    data: {
      ...r,
      exam,
    },
  });
};

export const deleteTest = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new Error("Tham số không hợp lệ");
  }

  const r = await Test.destroy({ where: { id } });
  if (r < 1) {
    throw new Error("Lỗi xoá lịch sử thi");
  }

  res.status(200).json({
    success: true,
    data: {},
  });
};

// answers: {
//   quetionsId: [
//     answer1 chon,
//   ],
//   questionId2:[
//     answer2 chon,
//   ],
// nếu là tự luận
//    questionId3:[
//     content
//   ],
//   ....
// }
/** @type {express.RequestHandler} */
export const caculateTestScore = async (req, res) => {
  const { id, answers, finalAt } = req.body;

  if (!id || !answers || typeof answers !== "object" || !finalAt) {
    throw Error("Tham số không hợp lệ");
  }

  const t = await Test.findOne({ where: { id } }).then((r) => r?.toJSON());
  if (!t) {
    throw new Error("Bài thi đã bị xoá");
  }
  const u = await getAuthUser(req);

  const isTestOwner = t.userId === u.id;
  if (!t || !isTestOwner) {
    throw new Error("Người dùng không có quyền");
  }
  //caculate score and update
  const { score, correctAnswersCount } = calcScore(
    answers,
    t.correctAnswersMap
  );
  const [updated] = await Test.update(
    {
      score,
      answersMap: answers,
      status: StatusTest.Locked,
      correctAnswersCount,
      finalAt: new Date(finalAt),
    },
    {
      where: {
        id,
      },
    }
  );
  if (updated < 1) {
    throw new Error("Lỗi tính toán điểm");
  }
  const r = await Test.findOne({ where: { id } }).then((r) => r?.toJSON());
  const exam = await Exam.findOne({ where: { id: r.examId } }).then((r) =>
    r?.toJSON()
  );
  res.status(200).json({
    success: true,
    data: {
      ...r,
      exam,
    },
  });
};
