import { create } from "zustand";
import { ItemAnswer, Exam, Questions } from "@/utils/type";

interface ExamState {
  exam: Exam | null;
  setExam: (exam: Exam) => void;
  updateExam: (data: Partial<Exam>) => void;
  clearExam: () => void;
}

interface QuestionsState {
  questions: Questions[];
  setQuestions: (questions: Questions[]) => void;
  addQuestion: (question: Questions) => void;
  updateQuestion: (params: { index: number; content?: string }) => void;
  removeQuestion: (index: number) => void;
  clearQuestions: () => void;
}

interface AnswersState {
  answers: ItemAnswer[];
  setAnswers: (answers: ItemAnswer[]) => void;
  addAnswer: (params: { questionIndex: number; answer: ItemAnswer }) => void;
  updateAnswer: (params: { questionIndex: number; answerIndex: number; content?: string; isCorrect?: boolean }) => void;
  removeAnswer: (params: { questionIndex: number; answerIndex: number }) => void;
  clearAnswers: () => void;
}



export const useExamStore = create<ExamState & QuestionsState & AnswersState>((set, get) => ({
  exam: null,
  setExam: (exam) => set({ exam }),
  updateExam: (data) => {

    set((state) => {
      console.log('...data: ', data);
      console.log('state.exam: ', state.exam);
      const updatedExam = state.exam ? { ...state.exam, ...data } : {
        id: "",
        topic: data.topic ?? "",
        description: data.description ?? "",
        examTime: data.examTime ?? 0,
        status: data.status ?? "pending",
        questions: [...state.questions],
      };
      console.log('updatedExam: ', updatedExam);
      return { exam: updatedExam };
    })
  },
  
  clearExam: () => set({ exam: null }),

  questions: [],
  setQuestions: (questions) =>
    set((state) => {
      const setQuestions = state.exam ? { ...state.exam, questions } : null;
      return { questions, exam: setQuestions };
    }),

  addQuestion: (question) =>
    set((state) => {
      const addQuestion = [...state.questions, question];
      const updatedExam = state.exam ? { ...state.exam, questions: addQuestion } : null;
      return { questions: addQuestion, exam: updatedExam };
    }),

  // updateQuestion: ({ index, content }) => {
  //   set((state) => {
  //     console.log('state.questions: ', ...state.questions);
  //     const updatedQuestions = [...state.questions]; // Tạo bản sao của mảng
  //     console.log('updatedQuestions: ', updatedQuestions);
  //     updatedQuestions[index] = { ...updatedQuestions[index], content: content ?? '' }; // Chỉ cập nhật phần tử thay vì tạo mảng mới
  //     return { ...state, questions: updatedQuestions };
  //   });
  // },
  updateQuestion: ({ index, content }) => {
    set((state) => {
      const updatedQuestions = [...state.questions];
      
      if (!updatedQuestions[index]) return state; // Kiểm tra xem có câu hỏi tại index không
  
      // Cập nhật nội dung câu hỏi
      updatedQuestions[index] = { 
        ...updatedQuestions[index], 
        content: content ?? updatedQuestions[index].content 
      };
  
      // Cập nhật exam nếu có
      const updatedExam = state.exam 
        ? { ...state.exam, questions: updatedQuestions } 
        : null;
  
      return { questions: updatedQuestions, exam: updatedExam };
    });
  },
  
  

  removeQuestion: (index) =>
    set((state) => {
      const updatedQuestions = state.questions.filter((_, i) => i !== index);
      const updatedExam = state.exam ? { ...state.exam, questions: updatedQuestions } : null;
      return { questions: updatedQuestions, exam: updatedExam };
    }),
  clearQuestions: () => set({ questions: [], 
    exam: get() && get().exam ? { 
      // id: get().exam?.id ?? "" ,
      topic: get().exam?.topic ?? "" ,
      examTime: get().exam?.examTime ?? 0 ,
      status: get().exam?.status ?? 'inactive' ,
      description: get().exam?.description ?? "" ,
      questions: [] } 
    : null 
  }),

  answers: [],
  setAnswers: (answers) => set({ answers }),

  addAnswer: ({ questionIndex, answer }) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      if (!updatedQuestions[questionIndex]) return state;

      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        answers: [...(updatedQuestions[questionIndex].answers || []), answer],
      };

      const updatedExam = state.exam ? { ...state.exam, questions: updatedQuestions } : null;
      return { questions: updatedQuestions, exam: updatedExam };
    }),

  updateAnswer: ({ questionIndex, answerIndex, content, isCorrect }) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      if (!updatedQuestions[questionIndex] || !updatedQuestions[questionIndex].answers) return state;

      const updatedAnswers = [...updatedQuestions[questionIndex].answers];
      if (!updatedAnswers[answerIndex]) return state;

      updatedAnswers[answerIndex] = {
        ...updatedAnswers[answerIndex],
        content: content ?? updatedAnswers[answerIndex].content,
        isCorrect: isCorrect ?? updatedAnswers[answerIndex].isCorrect,
      };

      updatedQuestions[questionIndex].answers = updatedAnswers;
      const updatedExam = state.exam ? { ...state.exam, questions: updatedQuestions } : null;
      console.log('updatedExam: ', updatedExam);
      console.log('updatedQuestions: ', updatedQuestions);
      return { questions: updatedQuestions, exam: updatedExam };
    }),

  removeAnswer: ({ questionIndex, answerIndex }) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      if (!updatedQuestions[questionIndex] || !updatedQuestions[questionIndex].answers) return state;

      updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter(
        (_, i) => i !== answerIndex
      );

      const updatedExam = state.exam ? { ...state.exam, questions: updatedQuestions } : null;
      return { questions: updatedQuestions, exam: updatedExam };
    }),

  clearAnswers: () =>
    set((state) => {
      const updatedQuestions = state.questions.map((q) => ({ ...q, answers: [] }));
      const updatedExam = state.exam ? { ...state.exam, questions: updatedQuestions } : null;
      return { questions: updatedQuestions, exam: updatedExam };
    }),
}));
