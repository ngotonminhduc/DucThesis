import { Exam } from "../models/Exam.js";
import { checkUserAdmin } from "../utils/checkUserAdmin.js";
import { getAuthUser } from "../utils/getAuthUser.js";

export const createExam = async (req, res) => {
  const { topic, description, examTime, status } = req.body;

  if (!topic || !description || !examTime) {
    throw new Error("Tham số không hợp lệ");
  }

  const exam = await Exam.create({
    topic,
    description,
    examTime,
    status,
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
  const { id, topic, description, examTime, status } = req.body;

  if (!id || !topic || !description || !examTime) {
    throw new Error("Tham số không hợp lệ");
  }

  const n = await Exam.update(
    {
      topic,
      description,
      examTime,
      status,
    },
    { where: { id } }
  ).then((r) => r[0]);

  if (n < 1) {
    throw new Error("Đề thi không tồn tại");
  }

  const exam = await Exam.findOne({ where: { id } }).then((r) => r?.toJSON());

  res.status(200).json({
    success: true,
    data: { ...exam },
  });
};

export const getExams = async (req, res) => {
  const user = getAuthUser(req);
  let exams;
  if (user.isAdmin) {
    exams = await Exam.findAll({
      order: [["createdAt", "desc"]],
    }).then((arr) => arr.map((r) => r.toJSON()));
  } else {
    exams = await Exam.findAll({
      where: { status: "active" },
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
