import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./config/initDB.js";
import { login, me, register } from "./controller/auth.controller.js";
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
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from "./controller/question.controller.js";
import {
  createAnswer,
  deleteAnswer,
  getAnswers,
  updateAnswer,
} from "./controller/answer.controller.js";
import {
  createTest,
  deleteTest,
  getTests,
  updateTest,
  submitTest,
} from "./controller/test.controller.js";
import { configdb } from "./config/config.js";
import { seedAdmin } from "./seed/index.js"

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
app.post("/register", register);
app.get("/me", verifyTokenMiddleware, me);

// EXAM
app.post(
  "/exam/create",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  createExam
);
app.patch(
  "/exam/update",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  updateExam
);
app.get(
  "/exam/gets",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  getExams
);
app.get("/exam/get", verifyTokenMiddleware, authorizeSystemMiddleware, getExam);
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
app.patch(
  "/question/update",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  updateQuestion
);
app.get(
  "/question/gets",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  getQuestions
);
app.post(
  "/question/delete",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  deleteQuestion
);

// ANSWER
app.post(
  "/answer/create",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  createAnswer
);
app.patch(
  "/answer/update",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  updateAnswer
);
app.get(
  "/answer/gets",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  getAnswers
);
app.post(
  "/answer/delete",
  verifyTokenMiddleware,
  authorizeSystemMiddleware,
  deleteAnswer
);


app.post("/test/create", verifyTokenMiddleware, createTest);
app.get("/test/gets", verifyTokenMiddleware, getTests);
app.post("/test/delete", verifyTokenMiddleware, deleteTest);
app.post("/test/submit", verifyTokenMiddleware, submitTest);

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
    if(configdb.dbSeed){
      await seedAdmin()
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Server không thể khởi động do lỗi kết nối DB:", error);
  });
