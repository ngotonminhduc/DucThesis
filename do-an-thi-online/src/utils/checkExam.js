import { Exam } from "../models/Exam.js"


export const checkExamActive = async (examId) =>{
  const existExam = await Exam.findOne({where: {id: examId}}).then(r => r?.toJSON())
  if (existExam.status === "active" ) {
    return true
  }
  return false
}