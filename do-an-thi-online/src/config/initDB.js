import { User } from "../models/User.js";
import { Exam } from "../models/Exam.js";
import { configdb } from "./config.js";
import { s2g } from "./database.js";

// Đăng ký model vào Sequelize
const initModels = async () => {
  await User.sync();
  await Exam.sync();
};

export const connectDatabase = async () => {
  try {
    const { dbSyncForce } = configdb;
    console.log(dbSyncForce);

    const mode = dbSyncForce ? "force" : "alter";
    console.debug(`syncing db from models... mode=${mode}`);
    const sync = { [mode]: true };

    await s2g.authenticate();
    console.log("✅ Đã kết nối với PostgreSQL!");

    initModels(); // Đăng ký các model trước khi sync
    await s2g.sync({ ...(sync && sync) }); // Không xóa bảng cũ
    console.log("✅ Sequelize đã đồng bộ!");
  } catch (error) {
    console.error("❌ Kết nối PostgreSQL thất bại:", error);
    throw error; // Để có thể xử lý lỗi ở nơi khác
  }
};
