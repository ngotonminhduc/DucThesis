import express from 'express'
import 'dotenv/config'
import cors from "cors";
import bodyParser from "body-parser";
import { connectDatabase } from './config/initDB.js';
import { login, me, register } from './controller/auth.controller.js';
import 'express-async-errors'
import { verifyTokenMiddleware } from './middleware/verifyToken.middleware.js';

process.on('uncaughtException', (err) => {
  console.error(err)
})

process.on('unhandledRejection', err => {
  console.error(err)
})

const PORT = process.env.PORT || 4000

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());


app.post("/login", login);
app.post("/register",register);
app.get('/me', verifyTokenMiddleware, me)


app.use((err, req, res, next) => {
  console.log(err)
  res.status(400).json({
    sucess: false,
    message: err.message
  })
})

// Gọi hàm kết nối database, sau đó mới start server
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Server không thể khởi động do lỗi kết nối DB:", error);
  });

