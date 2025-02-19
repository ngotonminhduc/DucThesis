// import { Request, Response } from "express";

// // 📌 Lấy danh sách tất cả Users
// export const getUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi server" });
//   }
// };

// // 📌 Lấy thông tin một User theo ID
// export const getUserById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByPk(id);

//     if (!user) {
//       return res.status(404).json({ error: "User không tồn tại" });
//     }

//     return res.json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Lỗi server" });
//   }
// };
// // 📌 Tạo mới User
// export const createUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;
//     const newUser = await User.create({ name, email, password });
//     console.log('newUser: ', newUser);
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.log('error: ', error);
//     return res.status(500).json({ error: "Lỗi server" });
//   }
// };

// // 📌 Cập nhật User
// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: "User không tồn tại" });

//     await user.update({ name, email, password });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi server" });
//   }
// };

// // 📌 Xóa User
// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findByPk(req.params.id);
//     if (!user) return res.status(404).json({ error: "User không tồn tại" });

//     await user.destroy();
//     res.json({ message: "Xóa User thành công" });
//   } catch (error) {
//     res.status(500).json({ error: "Lỗi server" });
//   }
// };
