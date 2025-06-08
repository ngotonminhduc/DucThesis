import { Role, User, UserRole } from "../models/index.js";
import { RoleName } from "../utils/type.js";

// Danh sách các Role cơ bản
const DEFAULT_ROLES = [
  {
    name: RoleName.ADMIN,
    description: "Quản trị viên hệ thống",
  },
  {
    name: RoleName.USER,
    description: "Người dùng thông thường",
  },
  {
    name: RoleName.EDITOR,
    description: "Người biên soạn",
  },
];

/**
 * Seed các role mặc định
 * @returns {Promise<void>}
 */
export const seedRoles = async () => {
  const promises = DEFAULT_ROLES.map(async (role) => {
    const existingRole = await Role.findOne({
      where: { name: role.name },
    }).then((r) => r?.toJSON());

    if (existingRole) {
      // Cập nhật role nếu đã tồn tại
      await Role.update(role, {
        where: { id: existingRole.id },
      });
      return existingRole;
    }

    // Tạo role mới nếu chưa tồn tại
    return await Role.create(role).then((r) => r.toJSON());
  });

  await Promise.all(promises);
  console.log("Seeded roles successfully");
};

/**
 * Chuyển đổi từ isAdmin sang role ADMIN/USER
 * @returns {Promise<void>}
 */
export const migrateUsersToRoles = async () => {
  // Lấy tất cả user
  const users = await User.findAll().then((users) =>
    users.map((u) => u.toJSON())
  );

  // Lấy roles từ DB
  const adminRole = await Role.findOne({
    where: { name: RoleName.ADMIN },
  }).then((r) => r?.toJSON());
  const userRole = await Role.findOne({ where: { name: RoleName.USER } }).then(
    (r) => r?.toJSON()
  );

  if (!adminRole || !userRole) {
    throw new Error("Cannot find required roles. Please seed roles first.");
  }

  // Tạo UserRole cho mỗi user dựa trên trường isAdmin
  const promises = users.map(async (user) => {
    // Gán role dựa trên trường isAdmin
    const roleId = user.isAdmin ? adminRole.id : userRole.id;

    // Kiểm tra xem đã có bản ghi UserRole chưa
    const existingUserRole = await UserRole.findOne({
      where: { userId: user.id, roleId },
    }).then((r) => r?.toJSON());

    if (!existingUserRole) {
      // Tạo mới nếu chưa tồn tại
      await UserRole.create({
        userId: user.id,
        roleId,
      });
    }
  });

  await Promise.all(promises);
  console.log("Migrated users to role-based system successfully");
};
