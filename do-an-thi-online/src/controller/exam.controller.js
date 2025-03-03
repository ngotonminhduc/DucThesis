import { Exam } from "../models/Exam.js";
import moment from "moment";
import { checkExamActive } from "../utils/checkExam.js";
import { checkUserAdmin } from "../utils/checkUserAdmin.js";

export const createExam = async (req, res) => {
  const { topic, description, examTime, status } = req.body;

  if (!topic && !description && !examTime) {
    throw new Error("Invalid Params");
  }

  const exam = await Exam.create({
    topic,
    description,
    examTime,
    status,
  }).then((r) => r.toJSON());

  if (!exam) {
    throw new Error("Create exam again!");
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

  if (!id) {
    throw new Error("Invalid Params Id");
  }
  // const check = checkExamActive(id)
  // if (check) {
  //   throw new Error('Can not update exam!')
  // }

  await Exam.update(
    {
      topic,
      description,
      examTime,
      status,
    },
    { where: { id } }
  ).then((r) => r[0]);

  res.status(200).json({
    success: true,
    data: {},
  });
};

export const getExams = async (req, res) => {
  const id = req["user"]?.id;
  const isAdmin = await checkUserAdmin(id);

  let exams;
  if (isAdmin) {
    exams = await Exam.findAll({
      order: [["createdAt", "DESC"]],
    }).then((arr) => arr.map((r) => r.toJSON()));
  } else {
    exams = await Exam.findAll({
      where: { status: "active" },
      order: [["createdAt", "DESC"]],
    }).then((arr) => arr.map((r) => r.toJSON()));
  }

  res.status(200).json({
    success: true,
    data: {
      exams,
    },
  });
};

export const getExam = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "Invalid Params" });
  }

  const exams = await Exam.findOne({ where: { id } }).then((r) => r?.toJSON());

  res.status(200).json({
    success: true,
    data: {
      ...exams,
    },
  });
};

export const deleteExam = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new Error("Invalid Params");
  }

  const existExam = await Exam.findOne({ where: { id } }).then((r) =>
    r?.toJSON()
  );

  if (!existExam) {
    throw new Error("Can not delete exam!");
  }

  await Exam.destroy({ where: { id } });

  res.status(200).json({
    success: true,
    data: {},
  });
};
