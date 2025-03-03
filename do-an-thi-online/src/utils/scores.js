import { Answer } from "../models/Answer.js";

export const caclAnswerScore = async (examId) => {
  // Lấy mảng answer thuộc examId
  const answerArrays = await Answer.findAll({ where: { examId, isCorrect: true } });

  // Lấy danh sách id question
  const questionIds = answerArrays.map(answer => answer.questionId);

  const correctAnswers = (
    await Promise.all(
      questionIds.map(async questionId => 
        Answer.findAll({ where: { questionId, isCorrect: true } })
      )
    )
  ).flat();
  const correctArr = correctAnswers.map(r => r.toJSON())
  
  console.log("🚀 ~ ScoresAnswer ~ correctAnswers:", correctArr );
};
