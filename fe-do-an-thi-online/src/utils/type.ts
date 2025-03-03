export type ExamFormData  = {
  topic: string;
  examTime: number;
  description: string;
  status: Status;
  questions: {
    content: string;
    answers: {
      content: string;
      isCorrect: boolean;
    }[];
  }[];
};




export type LoginResponse = {
  data:{
    token: string;
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }
}
export type RegisterResponse = {
  user: {
    createdAt: string,
    id: string,
    name: string,
    email: string,
    isAdmin: boolean,
  }
}


export type Exam = {
  topic: string;
  description: string;
  examTime: number;
  status: Status;
  questions?: {
    content: string;
    answers: {
      content: string;
      isCorrect: boolean;
    }[];
  }[];
}

// export type Answer = {
//   // id: string;
//   content: string;
//   isCorrect: boolean;
// };



// export type QuestionsEx = Array<{
//   examId: string;
//   content: string;
//   answers: Answer
// }>;





export enum StatusExam {
  "active" = "active",
  "pending" = "pending",
  "inactive" = "inactive",
}

export type Status = keyof typeof StatusExam
export const statusArray = Object.entries(StatusExam).map(([key, value]) => ({
  value,
  label: key,
}));

export type ResponseExam = {
  success: boolean,
  data: {
    id: string,
    status: Status,
    topic: string,
    description: string,
    examTime: number,
    createdAt: string
  }
}
export type ResponseExams = {
  success: boolean,
  data: {
    exams:Array<{
      id: string,
      status: Status,
      topic: string,
      description: string,
      examTime: number,
      createdAt: string
    }>
  }
}
export type ItemExam = {
  id: string,
  status: Status,
  topic: string,
  description: string,
  examTime: number,
  createdAt: string
} | null

export type ListExam = Array<ItemExam>




// export type Questions = {
//   examId: string;
//   content: string;
//   answers: Answer[]
// };

export type ItemQuestion = {
  id: string,
  examId: string,
  content: string,
  createdAt: string,
}
export type Questions = {
  id: string,
  examId: string,
  content: string,
  createdAt: string,
  answers: ListAnswer
}
export type ListUpdateQuestion = Array<Questions>
export type ListQuestion = Array<ItemQuestion>

export type ResponseQuestions = {
  success: boolean,
  data: {
    questions:Array<{
      id: string,
      examId: string,
      content: string,
      createdAt: string
    }>
  }
}
export type ResponseQuestion = {
  success: boolean,
  data: {
    id: string,
    examId: string,
    content: string,
    createdAt: string
  }
}



export type ItemAnswer = {
  id: string,
  questionId:string
  examId: string,
  content: string,
  isCorrect: boolean,
  createdAt: string
}
export type ListAnswer = Array<ItemAnswer>

export type ResponseAnswer = {
  success: boolean,
  data: {
    id: string,
    examId: string,
    content: string,
    isCorrect: boolean,
    createdAt: string
  }
}
export type ResponseAnswers = {
  success: boolean,
  data: {
    answers:Array<{
      id: string,
      examId: string,
      questionId: string,
      content: string,
      isCorrect: boolean,
      createdAt: string
    }>
  }
}


export type ResponseUser = {
  success: boolean,
  data: {
    user: User
  }
}

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}