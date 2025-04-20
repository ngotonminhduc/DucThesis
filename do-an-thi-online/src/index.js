import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./config/initDB.js";
import { login, loginWithSocial, me, register } from "./controller/auth.controller.js";
import "express-async-errors";
import { verifyTokenMiddleware } from "./middleware/verifyToken.middleware.js";
import {
  createExam,
  deleteExam,
  getExam,
  getExams,
  updateExam,
} from "./controller/exam.controller.js";
import { authorizeSystemMiddleware } from "./middleware/authorizeSystem.middleware.js";
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
import { seedAdmin } from "./seed/index.js";

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
  authorizeSystemMiddleware,
  createExam
);
app.post(
  "/exam/update",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
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
  authorizeSystemMiddleware,
  deleteExam
);

// QUESTION
app.post(
  "/question/create",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  createQuestion
);

// QUESTION
app.post(
  "/question/create-many",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  createQuestions
);

app.post(
  "/question/update",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  updateQuestion
);
app.get("/question/gets", verifyTokenMiddleware, getQuestions);

app.post(
  "/question/delete",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  deleteQuestion
);

app.post(
  "/question/delete-all",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  deleteAllQuestions
);

// ANSWER
app.post(
  "/answer/create",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  createAnswer
);

app.post(
  "/answer/create-many",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  createAnswers
);

app.post(
  "/answer/update",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  updateAnswer
);
app.get("/answer/gets", verifyTokenMiddleware, getAnswers);

app.post(
  "/answer/delete",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  deleteAnswer
);

app.post(
  "/answer/delete-all",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  deleteAllAnswers
);

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
      await seedAdmin();
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Server không thể khởi động do lỗi kết nối DB:", error);
  });
