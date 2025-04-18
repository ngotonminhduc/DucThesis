
import { ItemAnswer } from "@/utils/type";

export type AnswerClientProps = {
  answers: ItemAnswer;
  userAnswer?: string;
  correctAnswers: string[]; // Danh sách ID câu trả lời đúng từ hệ thống
  disabled?: boolean;
};

export const AnswersTestClient = ({
  answers,
  userAnswer,
  correctAnswers,
  disabled,
}: AnswerClientProps) => {
  const isCorrect = correctAnswers.includes(answers.id); // Kiểm tra đáp án đúng từ server
  const isUserSelected = userAnswer === answers.id; // Kiểm tra user đã chọn đáp án này

  return (
    <div
      className={`mt-3 py-2 border w-full rounded-md cursor-pointer 
      ${isCorrect ? "bg-green-300" : ""} 
      ${isUserSelected && !isCorrect ? "bg-red-200" : ""}
    `}
    >
      <label className="flex items-center gap-3 px-3 cursor-pointer">
        <input
          type="checkbox"
          value={answers.id}
          checked={isUserSelected}
          disabled
          className="w-5 h-5 rounded-full border-2 border-gray-500 appearance-none checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
        />
        {answers.content}
      </label>
    </div>
  );
};

























// import { ItemAnswer } from "@/utils/type";

// export type AnswerClientProps = {
//   answers: ItemAnswer;
//   selectedOption: string;
//   userAnswer?: string;
//   correctAnswers: string[]; // Danh sách ID câu trả lời đúng
//   disabled?: boolean;
// };

// export const AnswersTestClient = ({
//   answers,
//   selectedOption,
//   disabled,
//   userAnswer,
//   correctAnswers,
// }: AnswerClientProps) => {
//   const isCorrect = correctAnswers.includes(answers.id); // Kiểm tra nếu đáp án là đúng
//   console.log("🚀 ~ isCorrect:", isCorrect)
//   const isSelected = selectedOption === answers.id; // Kiểm tra nếu đáp án này được chọn
//   console.log("🚀 ~ isSelected:", isSelected)

//   return (
//     <div
//       className={`mt-3 py-2 border w-full rounded-md cursor-pointer 
//       ${isSelected && disabled && isCorrect ? "bg-green-400" : ""}
//       ${isSelected && disabled && !isCorrect ? "bg-red-400" : ""}
//       ${userAnswer === answers.id && disabled ? "bg-blue-300" : ""}
//     `}
//     >
//       <label className="flex items-center gap-3 px-3 cursor-pointer">
//         <input
//           type="checkbox"
//           value={answers.id}
//           checked={isSelected}
//           disabled
//           className="w-5 h-5 rounded-full border-2 border-gray-500 appearance-none checked:bg-blue-500 checked:border-blue-500 focus:outline-none"
//         />
//         {answers.content}
//       </label>
//     </div>
//   );
// };
