import { User } from "../models/User.js";
import { hashPassword } from "../utils/hashPassword.js";

export const seedAdmin = async () => {
  const admin = [
    {
      email: "thionline@gmail.com",
      name: "Thi Online Admin",
      password: hashPassword('Thionline@2025'),
      isAdmin: true
    },
  ];
  const p = admin.map(async (u) => {
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
      return;
    }
    await User.create(u);
  });
  await Promise.all(p);
};
