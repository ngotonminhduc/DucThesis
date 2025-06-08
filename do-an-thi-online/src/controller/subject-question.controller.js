import { Subject } from "../models/Subject.js";
import { SubjectQuestion } from "../models/SubjectQuestion.js";

export const createSubjectQuestion = async (req, res) => {
  const { subjectId, content, type, idx } = req.body;

  if (!subjectId || !content || !type) {
    throw new Error("Tham số không hợp lệ");
  }

  const existSubject = await Subject.findOne({ where: { id: subjectId } }).then(
    (r) => r?.toJSON()
  );
  if (!existSubject) {
    throw new Error("Ngân hàng đề không tồn tại!");
  }

  const ques = await SubjectQuestion.create({
    subjectId,
    content,
    type,
    idx
  }).then((r) => r.toJSON());

  res.status(200).json({
    success: true,
    data: {
      ...ques,
    },
  });
};

export const createSubjectQuestions = async (req, res) => {
  const { data } = req.body;

  if (typeof data !== "object" && !Array.from(data).length) {
    throw new Error("Tham số không hợp lệ");
  }

  const subjectId = data[0]?.["subjectId"];
  if (!subjectId) {
    throw new Error("Cần truyền subjectId");
  }

  const existSubject = await Subject.findOne({ where: { id: subjectId } }).then(
    (r) => r?.toJSON()
  );
  if (!existSubject) {
    throw new Error("Môn thi không tồn tại!");
  }

  const ques = await SubjectQuestion.bulkCreate(data, {
    ignoreDuplicates: true,
  }).then((r) => r.map((d) => d?.toJSON()));

  res.status(200).json({
    success: true,
    data: ques,
  });
};

export const getSubjectQuestions = async (req, res) => {
  const { subjectId, limit = 100, page = 0 } = req.query;

  if (!subjectId) {
    throw new Error("Tham số không hợp lệ");
  }
  const subjectQuestions = await SubjectQuestion.findAll({
    where: { subjectId },
    limit,
    offset: (page <= 0 ? 0 : page - 1) * limit,
    order: [["idx", "asc"]],
  }).then((arr) => arr.map((r) => r.toJSON()));

  const count = await SubjectQuestion.count({
    where: { subjectId },
  });

  res.status(200).json({
    success: true,
    data: {
      totalCount: count,
      items: subjectQuestions,
    },
  });
};

export const deleteAllSubjectQuestions = async (req, res) => {
  const { subjectId } = req.body;

  if (!subjectId || typeof subjectId !== "string") {
    throw new Error("Tham số không hợp lệ");
  }

  await SubjectQuestion.destroy({
    where: {
      subjectId,
    },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
