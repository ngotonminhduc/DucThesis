import { Subject } from "../models/Subject.js";

const DEFAULT_SUBJECTS = [
  {
    title: "Toán",
    description: "Môn Toán",
  },
  {
    title: "Văn",
    description: "Môn Văn",
  },
  {
    title: "Anh",
    description: "Môn Anh",
  },
];

export const seedSubjects = async () => {
  const promises = DEFAULT_SUBJECTS.map(async (subject) => {
    const existingSubject = await Subject.findOne({
      where: { title: subject.title },
    }).then((r) => r?.toJSON());

    if (existingSubject) {
      // Cập nhật subject nếu đã tồn tại
      await Subject.update(subject, {
        where: { id: existingSubject.id },
      });
      return existingSubject;
    }

    // Tạo subject mới nếu chưa tồn tại
    return await Subject.create(subject).then((r) => r.toJSON());
  });

  await Promise.all(promises);
  console.log("Seeded subjects successfully");
};
