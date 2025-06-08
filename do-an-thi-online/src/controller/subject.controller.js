import express from "express";
import { Subject } from "../models/Subject.js";

/** @type {express.RequestHandler} */
export const getSubjects = async (req, res) => {
  const subjects = await Subject.findAll({
    order: [["createdAt", "desc"]],
  }).then((arr) => arr.map((r) => r.toJSON()));

  res.status(200).json({
    success: true,
    data: subjects,
  });
};

export const getSubject = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Tham số không hợp lệ" });
  }

  const subject = await Subject.findOne({ where: { id } }).then((r) =>
    r?.toJSON()
  );
  if (!subject) {
    throw new Error("Không tìm thấy môn học");
  }
  res.status(200).json({
    success: true,
    data: { ...subject },
  });
};
