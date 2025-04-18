import _ from "lodash";
/**
 *
 * @param {Record<string, string[]>} answerMap
 * @param {Record<string, string[]>} correctAnswersMap
 * @param {object} [options]
 * @param {number} [options.totalScore]
 */
export const calcScore = (answerMap, correctAnswersMap, options) => {
  let score = 0;
  let correctAnswersCount = 0;
  const totalScore = options?.totalScore ?? 10;
  const count = totalScore / Object.keys(correctAnswersMap).length;
  Object.entries(answerMap).forEach(([qId, aId]) => {
    if (_.isEqual(correctAnswersMap[qId], aId)) {
      score += count;
      correctAnswersCount++;
    }
  });
  return {
    score,
    correctAnswersCount,
  };
};
