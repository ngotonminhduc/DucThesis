import { Op } from "sequelize";
import { Exam } from "../models/Exam.js";
import { checkUserRole } from "../utils/checkUserRole.js";
import { getAuthUser } from "../utils/getAuthUser.js";

export const createExam = async (req, res) => {
  const { topic, description, examTime, status, subjectId } = req.body;

  if (!topic || !description || !examTime || !subjectId) {
    throw new Error("Tham số không hợp lệ");
  }

  const exam = await Exam.create({
    topic,
    description,
    examTime,
    status,
    subjectId,
  }).then((r) => r.toJSON());

  if (!exam) {
    throw new Error("Hãy tạo lại bài kiểm tra!");
  }

  res.status(200).json({
    success: true,
    data: {
      ...exam,
    },
  });
};

export const updateExam = async (req, res) => {
  const { id, topic, description, examTime, status, tagQuantity } = req.body;

  if (!id) {
    throw new Error("Tham số không hợp lệ");
  }

  const existExam = await Exam.findOne({
    where: {
      id,
      status: "pending",
    },
  }).then((r) => r?.toJSON());

  if (!existExam) {
    throw new Error("Không thể cập nhật bài kiểm tra!");
  }

  await Exam.update(
    { topic, description, examTime, status, tagQuantity },
    { where: { id } }
  );

  const exam = await Exam.findOne({ where: { id } }).then((r) => r?.toJSON());

  res.status(200).json({
    success: true,
    data: { ...exam },
  });
};

export const getExams = async (req, res) => {
  const user = getAuthUser(req);
  let exams;

  // Kiểm tra xem user có role ADMIN không
  const isAdmin = await checkUserRole(user.id, "ADMIN");

  if (isAdmin) {
    // Admin có thể xem tất cả bài thi
    exams = await Exam.findAll({
      order: [["createdAt", "desc"]],
    }).then((arr) => arr.map((r) => r.toJSON()));
  } else {
    // User thường chỉ xem được bài thi active
    exams = await Exam.findAll({
      where: {
        status: {
          [Op.notIn]: ["inactive"],
        },
      },
      order: [["createdAt", "desc"]],
    }).then((arr) => arr.map((r) => r.toJSON()));
  }

  res.status(200).json({
    success: true,
    data: exams,
  });
};

export const getExam = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Tham số không hợp lệ" });
  }

  const exam = await Exam.findOne({ where: { id } }).then((r) => r?.toJSON());
  res.status(200).json({
    success: true,
    data: { ...exam },
  });
};

export const deleteExam = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new Error("Tham số không hợp lệ");
  }

  const existExam = await Exam.findOne({ where: { id } }).then((r) =>
    r?.toJSON()
  );

  if (!existExam) {
    throw new Error("Không thể xóa bài thi!");
  }

  await Exam.destroy({ where: { id } });

  res.status(200).json({
    success: true,
    data: {},
  });
};
