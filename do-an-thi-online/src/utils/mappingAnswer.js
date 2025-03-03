import { Answer } from "../models/Answer.js";
import { Question } from "../models/Question.js";

/**
 *
 * @param {string} examId
 * @description Mapping key là question id, còn value là correct answers array
 * @returns {Record<string, string[]>}
 */
export const mappingCorrectAnswers = async (examId) => {
  const map = {};
  const questionIds = await Question.findAll({
    where: { examId },
    attributes: ["id"],
  }).then((arr) => arr.map((r) => r.toJSON().id));
  const p = questionIds.map(async (qId) => {
    const answerIds = await Answer.findAll({
      where: { questionId: qId, isCorrect: true },
      attributes: ["id"],
    }).then((arr) => arr.map((r) => r.toJSON().id));
    map[q.id] = answerIds;
  });
  await Promise.all(p);
  return map;
};
