import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { UserRole } from "../models/UserRole.js";
import { hashPassword } from "../utils/hashPassword.js";
import { RoleName } from "../utils/type.js";

const DEFAULT_USERS = [
  {
    email: "thionline@gmail.com",
    name: "Thi Online Admin",
    password: hashPassword("Thionline@2025"),
    isAdmin: true,
    role: RoleName.ADMIN,
  },
  {
    email: "editor@gmail.com",
    name: "Thi online Editor",
    password: hashPassword("Editor@2025"),
    isAdmin: false,
    role: RoleName.EDITOR,
  },
];

const seedUserRoleIfNoExisted = async (userId, roleId) => {
  // Kiểm tra xem đã có bản ghi UserRole chưa
  const existingUserRole = await UserRole.findOne({
    where: { userId, roleId },
  }).then((r) => r?.toJSON());

  if (!existingUserRole) {
    // Tạo mới nếu chưa tồn tại
    await UserRole.create({
      userId,
      roleId,
    });
  }
};

export const seedUsers = async () => {
  const p = DEFAULT_USERS.map(async (u) => {
    const role = await Role.findOne({ where: { name: u.role } }).then((r) =>
      r?.toJSON()
    );
    if (!role) {
      throw new Error("Cannot find required roles. Please seed roles first.");
    }
    const d = await User.findOne({
      where: {
        email: u.email,
      },
    }).then((r) => r?.toJSON());
    if (d) {
      await User.update(d, {
        where: {
          id: d.id,
        },
      });
      await seedUserRoleIfNoExisted(d.id, role.id);
      return;
    }
    const newUser = await User.create(u).then((r) => r?.toJSON());
    await seedUserRoleIfNoExisted(newUser.id, role.id);
  });

  await Promise.all(p);
};
