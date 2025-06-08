import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./config/initDB.js";
import {
  login,
  loginWithSocial,
  me,
  register,
} from "./controller/auth.controller.js";
import "express-async-errors";
import { verifyTokenMiddleware } from "./middleware/verifyToken.middleware.js";
import {
  createExam,
  deleteExam,
  getExam,
  getExams,
  updateExam,
} from "./controller/exam.controller.js";
import { authorizeRole } from "./middleware/authorizeRole.middleware.js";
import {
  createQuestion,
  createQuestions,
  deleteQuestion,
  deleteAllQuestions,
  getQuestions,
  updateQuestion,
} from "./controller/question.controller.js";
import {
  createAnswer,
  createAnswers,
  deleteAllAnswers,
  deleteAnswer,
  getAnswers,
  updateAnswer,
} from "./controller/answer.controller.js";
import {
  activeTest,
  caculateTestScore,
  createTest,
  deleteTest,
  getTest,
  getTests,
} from "./controller/test.controller.js";
import { configdb } from "./config/config.js";
import {
  migrateUsersToRoles,
  seedRoles,
  seedSubjects,
  seedUsers,
} from "./seed/index.js";

import { getSubject, getSubjects } from "./controller/subject.controller.js";

import {
  createSubjectQuestion,
  createSubjectQuestions,
  deleteAllSubjectQuestions,
  getSubjectQuestions,
} from "./controller/subject-question.controller.js";
import { RoleName } from "./utils/type.js";
import {
  createSubjectAnswers,
  deleteAllSubjectAnswers,
  getSubjectAnswers,
} from "./controller/subject-answer.controller.js";
import {
  createTags,
  deleteAllTags,
  getTag,
} from "./controller/tag.controller.js";

process.on("uncaughtException", (err) => {
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
});

const PORT = process.env.PORT || 4000;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // ⚠️ Chỉ định đúng frontend URL
    credentials: true, // ✅ Quan trọng: Cho phép cookie/token
  })
);
app.options("*", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// AUTH
app.post("/login", login);
app.post("/social-login", loginWithSocial);
app.post("/register", register);
app.get("/me", verifyTokenMiddleware, me);

// EXAM
app.post(
  "/exam/create",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  createExam
);

app.post(
  "/exam/update",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  updateExam
);

/**
 * nếu check authorizeSystemMiddleware thì client sẽ không gọi api được: 1 là tạo api khác 2 là không check
 *
 *  */
app.get("/exam/gets", verifyTokenMiddleware, getExams);

app.get("/exam/get", verifyTokenMiddleware, getExam);

app.post(
  "/exam/delete",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  deleteExam
);

// QUESTION
app.post(
  "/question/create",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  createQuestion
);

// QUESTION
app.post(
  "/question/create-many",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  createQuestions
);

app.post(
  "/question/update",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  updateQuestion
);
app.get("/question/gets", verifyTokenMiddleware, getQuestions);

app.post(
  "/question/delete",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  deleteQuestion
);

app.post(
  "/question/delete-all",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  deleteAllQuestions
);

// ANSWER
app.post(
  "/answer/create",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  createAnswer
);

app.post(
  "/answer/create-many",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  createAnswers
);

app.post(
  "/answer/update",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  updateAnswer
);
app.get("/answer/gets", verifyTokenMiddleware, getAnswers);

app.post(
  "/answer/delete",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  deleteAnswer
);

app.post(
  "/answer/delete-all",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  deleteAllAnswers
);

//SUBJECT
app.get(
  "/subject/gets",
  verifyTokenMiddleware,
  authorizeRole([RoleName.EDITOR, RoleName.ADMIN]),
  getSubjects
);

app.get(
  "/subject/get",
  verifyTokenMiddleware,
  authorizeRole([RoleName.EDITOR, RoleName.ADMIN]),
  getSubject
);

//SUBJECT QUESTION

app.post(
  "/subject-question/create",
  verifyTokenMiddleware,
  authorizeRole(RoleName.EDITOR),
  createSubjectQuestion
);

app.post(
  "/subject-question/create-many",
  verifyTokenMiddleware,
  authorizeRole(RoleName.EDITOR),
  createSubjectQuestions
);

app.get(
  "/subject-question/gets",
  verifyTokenMiddleware,
  authorizeRole([RoleName.EDITOR, RoleName.ADMIN]),
  getSubjectQuestions
);

app.post(
  "/subject-question/delete-all",
  verifyTokenMiddleware,
  authorizeRole(RoleName.EDITOR),
  deleteAllSubjectQuestions
);

//SUBJECT ANSWER
app.post(
  "/subject-answer/create-many",
  verifyTokenMiddleware,
  authorizeRole(RoleName.EDITOR),
  createSubjectAnswers
);

app.post(
  "/subject-answer/create",
  verifyTokenMiddleware,
  authorizeRole(RoleName.EDITOR),
  createSubjectAnswers
);

app.get(
  "/subject-answer/gets",
  verifyTokenMiddleware,
  authorizeRole([RoleName.EDITOR, RoleName.ADMIN]),
  getSubjectAnswers
);

app.post(
  "/subject-answer/delete-all",
  verifyTokenMiddleware,
  authorizeRole(RoleName.EDITOR),
  deleteAllSubjectAnswers
);

//TAG
app.post(
  "/tag/bulk-create",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  createTags
);

app.post(
  "/tag/get-random",
  verifyTokenMiddleware,
  authorizeRole(RoleName.USER),
  getTag
);

app.post(
  "/tag/delete-all",
  verifyTokenMiddleware,
  authorizeRole(RoleName.ADMIN),
  deleteAllTags
);

//TEST
app.post("/test/create", verifyTokenMiddleware, createTest);
app.get("/test/gets", verifyTokenMiddleware, getTests);
app.get("/test/get", verifyTokenMiddleware, getTest);
app.post("/test/delete", verifyTokenMiddleware, deleteTest);
app.post("/test/active", verifyTokenMiddleware, activeTest);
app.post("/test/calc-score", verifyTokenMiddleware, caculateTestScore);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).json({
    sucess: false,
    message: err.message,
  });
});

// Gọi hàm kết nối database, sau đó mới start server
connectDatabase()
  .then(async () => {
    if (configdb.dbSeed) {
      await seedRoles();
      await seedUsers();
      await migrateUsersToRoles();
      await seedSubjects();
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Server không thể khởi động do lỗi kết nối DB:", error);
  });
