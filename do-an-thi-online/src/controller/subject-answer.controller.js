import { SubjectAnswer } from "../models/SubjectAnswer.js";
import { SubjectQuestion } from "../models/SubjectQuestion.js";
import { QuesType } from "../utils/type.js";

export const createSubjectAnswers = async (req, res) => {
  const { data } = req.body;

  if (!data || (typeof data !== "object" && !Array.from(data).length)) {
    throw new Error("Tham số không hợp lệ");
  }

  const subjectQuestionId = data[0]?.["subjectQuestionId"];
  if (!subjectQuestionId) {
    throw new Error("Cần truyền subjectQuestionId");
  }

  const existQuestion = await SubjectQuestion.findOne({
    where: { id: subjectQuestionId },
  }).then((r) => r?.toJSON());

  if (!existQuestion) {
    throw new Error("Câu hỏi không tồn tại!");
  }

  if (existQuestion.type === QuesType.Essay) {
    throw new Error("Câu hỏi tự luận không cần tạo câu trả lời");
  }

  const answers = await SubjectAnswer.bulkCreate(data).then((arr) =>
    arr.map((r) => r?.toJSON())
  );

  res.status(200).json({
    success: true,
    data: answers,
  });
};

export const getSubjectAnswers = async (req, res) => {
  const { subjectQuestionId, limit = 100, page = 0 } = req.query;

  if (!subjectQuestionId) {
    throw new Error("Tham số không hợp lệ");
  }

  const answers = await SubjectAnswer.findAll({
    where: { subjectQuestionId },
    limit,
    offset: page,
    order: [["idx", "ASC"]],
  }).then((arr) => arr.map((r) => r.toJSON()));

  const count = await SubjectAnswer.count({
    where: { subjectQuestionId },
  });
  res.status(200).json({
    success: true,
    data: {
      totalCount: count,
      items: answers,
    },
  });
};

export const deleteAllSubjectAnswers = async (req, res) => {
  const { subjectId } = req.body;

  if (!subjectId || typeof subjectId !== "string") {
    throw new Error("Tham số không hợp lệ");
  }
  await SubjectAnswer.destroy({ where: { subjectId } });

  res.status(200).json({
    success: true,
    data: {},
  });
};
