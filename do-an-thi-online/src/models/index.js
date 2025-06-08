import { User } from "./User.js";
import { Role } from "./Role.js";
import { UserRole } from "./UserRole.js";
import { Exam } from "./Exam.js";
import { Question } from "./Question.js";
import { Answer } from "./Answer.js";
import { Test } from "./Test.js";
import { Subject } from "./Subject.js";
import { SubjectAnswer } from "./SubjectAnswer.js";
import { SubjectQuestion } from "./SubjectQuestion.js";
import { Tag } from "./Tag.js";

// Thiết lập mối quan hệ User-Role nhiều-nhiều thông qua UserRole
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  as: "roles",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  as: "users",
});
Answer.belongsTo(Question, { foreignKey: "questionId", onDelete: "CASCADE" });
Answer.belongsTo(Exam, { foreignKey: "examId", onDelete: "CASCADE" });
Question.belongsTo(Exam, { foreignKey: "examId", onDelete: "CASCADE" });
Exam.belongsToMany(User, {
  through: Test,
  foreignKey: "examId",
  onDelete: "CASCADE",
});
User.belongsToMany(Exam, { through: Test, foreignKey: "userId" });
Exam.belongsToMany(User, { through: Test, foreignKey: "examId" });

SubjectAnswer.belongsTo(SubjectQuestion, { foreignKey: "subjectQuestionId" });
SubjectAnswer.belongsTo(Subject, { foreignKey: "subjectId" });

SubjectQuestion.belongsTo(Subject, { foreignKey: "subjectId" });

Tag.belongsTo(Exam, { foreignKey: "examId", onDelete: "CASCADE" });

// Xuất các model
export { User, Role, UserRole, Exam, Question, Answer, Test, Subject, Tag };
