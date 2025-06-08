import express from "express";
import { Exam, Question, Tag, Test } from "../models/index.js";
import { generateCodes } from "../utils/generateCodes.js";
import { shuffleArray } from "../utils/suffleArray.js";
import { s2g } from "../config/database.js";
import { Transaction } from "sequelize";
import { getAuthUser } from "../utils/getAuthUser.js";

/** @type {express.RequestHandler} */
export const createTags = async (req, res) => {
  const { examId } = req.body;

  if (!examId) {
    throw new Error("Tham số không hợp lệ");
  }

  const exam = await Exam.findOne({ where: { id: examId } }).then((r) =>
    r?.toJSON()
  );
  if (!exam) {
    throw new Error("Bài thi không tồn tại");
  }
  const questionIdxs = await Question.findAll({
    where: { examId },
    limit: 100,
    attributes: ["idx"],
  }).then((arr) => arr.map((r) => r?.toJSON().idx));

  const quantity = exam.tagQuantity;

  if (quantity > questionIdxs.length) {
    throw new Error(`Số lượng đề không được vượt quá số lượng câu hỏi`);
  }

  const codes = generateCodes(quantity);
  const tagsData = codes.map((code) => ({
    code,
    examId,
    mixQuestions: shuffleArray(questionIdxs),
  }));

  const tags = await Tag.bulkCreate(tagsData).then((arr) =>
    arr.map((r) => r?.toJSON())
  );

  res.status(200).json({
    success: true,
    data: tags,
  });
};

/** @type {express.RequestHandler} */
export const getTag = async (req, res) => {
  const { examId } = req.body;
  const user = getAuthUser(req);
  if (!examId) {
    throw new Error("Tham số không hợp lệ");
  }
  const exam = await Exam.findOne({ where: { id: examId } }).then((r) =>
    r?.toJSON()
  );
  if (!exam) {
    throw new Error("Bài thi không tồn tại");
  }

  const tag = await pickAndIncrementLowestWeightTag(examId);
  Test.update(
    {
      code: tag.code,
    },
    {
      where: {
        userId: user.id,
        examId,
      },
    }
  );
  res.status(200).json({
    success: true,
    data: { ...tag },
  });
};

/** @type {express.RequestHandler} */
export const deleteAllTags = async (req, res) => {
  const { examId } = req.body;

  if (!examId || typeof examId !== "string") {
    throw new Error("Tham số không hợp lệ");
  }

  await Tag.destroy({
    where: {
      examId,
    },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};

/**
 * Lấy tag có weight thấp nhất và tăng weight lên 1, toàn bộ trong một transaction.
 *
 * @param {string} examId - ID bài thi để lọc tag (nếu cần)
 * @returns {Promise<Object|null>} - Tag đã cập nhật dưới dạng JSON, hoặc null nếu không tìm thấy
 */
const pickAndIncrementLowestWeightTag = async (examId) => {
  return await s2g.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
    async (transaction) => {
      // 1. Lấy 1 bản ghi có weight thấp nhất, khóa hàng này để tránh các transaction khác đọc cùng lúc
      const tag = await Tag.findOne({
        where: { examId },
        order: [["weight", "ASC"]],
        transaction,
        lock: transaction.LOCK.UPDATE, // row-level FOR UPDATE lock :contentReference[oaicite:1]{index=1}
      });

      if (!tag) {
        return;
      }

      // 2. Tăng weight lên 1
      await tag.increment("weight", { by: 1, transaction }); // atomic increment :contentReference[oaicite:2]{index=2}

      await tag.reload({ transaction });
      return tag.toJSON();
    }
  );
};
