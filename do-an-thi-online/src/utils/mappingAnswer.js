import { Answer } from "../models/Answer.js";
import { Question } from "../models/Question.js";

/**
 * Lấy danh sách câu trả lời đúng của từng câu hỏi trong một kỳ thi.
 * @param {string} examId - ID của kỳ thi
 * @returns {Promise<Record<string, string[]>>} - Đối tượng ánh xạ questionId -> danh sách answerId đúng
 */
export const mappingCorrectAnswers = async (examId) => {
  const questions = await Question.findAll({
    where: { examId },
    attributes: ["id"],
    raw: true, // Giúp trả về object đơn giản, không cần `.toJSON()`
  });

  if (questions.length === 0) return {}; // Tránh truy vấn dư thừa nếu không có câu hỏi nào

  const questionIds = questions.map(q => q.id);

  const answers = await Answer.findAll({
    where: { questionId: questionIds, isCorrect: true },
    attributes: ["questionId", "id"],
    raw: true,
  });

  return answers.reduce((map, { questionId, id }) => {
    if (!map[questionId]) {
      map[questionId] = [];
    }
    map[questionId].push(id);
    return map;
  }, {});
};











// import { Answer } from "../models/Answer.js";
// import { Question } from "../models/Question.js";

// /**
//  *
//  * @param {string} examId
//  * @description Mapping key là question id, còn value là correct answers array
//  * @returns {Record<string, string[]>}
//  */
// export const mappingCorrectAnswers = async (examId) => {
//   const map = {};
//   const questionIds = await Question.findAll({
//     where: { examId },
//     attributes: ["id"],
//   }).then((arr) => arr.map((r) => r.toJSON().id));


//   const p = questionIds.map(async (qId) => {
//     const answerIds = await Answer.findAll({
//       where: { questionId: qId, isCorrect: true },
//       attributes: ["id"],
//     }).then((arr) => arr.map((r) => r.toJSON().id));
//     map[q.id] = answerIds;
//   });

//   await Promise.all(p);
//   return map;
// };
