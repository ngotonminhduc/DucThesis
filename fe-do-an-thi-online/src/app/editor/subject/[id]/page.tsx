"use client";

import { CardExam } from "@/components/card/CardExam";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/effect/Spinner";
import { Button } from "@/components/button/Button";
import { useSubjectQuestionStore } from "@/store/subject-question-store";
import { useSubjectAnswerStore } from "@/store/subject-answer-store";
import { SubjectQuestion } from "@/components/subject/SubjectQuestion/SubjectQuestion";
import {
  AddItemHandler,
  ChangeStateHandler,
  RemoveItemHandler,
  TStateSubjectQuestion,
  TStateSubjectAnswer,
  UpdateItemHandler,
} from "@/components/subject/SubjectQuestion/type";
import { useSubjectStore } from "@/store/subject-store";
import { toast } from "react-toastify";
import { TCreateSubjectAnswer, TSubjectAnswer } from "@/services/subjectAnswerService";
import { PaginationControls } from "@/components/exam/PaginationControls";
import { pageSize } from "@/utils/constants";
import { TextInput } from "@/components/input/TextInput";

/**
 * Trang quản lý chi tiết subject và ngân hàng câu hỏi
 * Cho phép người dùng thêm/sửa/xóa câu hỏi và câu trả lời
 */
function DetailSubjectPage() {
  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [questions, setQuestions] = useState<TStateSubjectQuestion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSizeNum = pageSize || 10;

  const {
    getSubjectQuestions,
    error: questionError,
    subjectQuestions: storedQuestions,
    isLoading: isQuestionLoading,
    deleteAllSubjectQuestions,
    createSubjectQuestion,
    clearError: clearQuestionError,
  } = useSubjectQuestionStore();

  const { detailSubject, subjects, isLoading } = useSubjectStore();

  const { createSubjectAnswers, deleteAllSubjectAnswers, getSubjectAnswers, subjectAnswers: subjectAnswersStore } =
    useSubjectAnswerStore();

  const [canUpdate, setCanUpdate] = useState<boolean>(false);

  const prevQuestionsLength = useRef(questions.length);

  // Memoized filtered questions
  const filteredQuestions = useMemo(() => {
    return questions
  }, [questions]);

  // Pagination
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredQuestions.length / pageSizeNum)),
    [filteredQuestions.length, pageSizeNum]
  );
  const paginatedQuestions = useMemo(
    () =>
      filteredQuestions.slice(
        (currentPage - 1) * pageSizeNum,
        currentPage * pageSizeNum
      ),
    [filteredQuestions, currentPage, pageSizeNum]
  );

  // State để theo dõi xem có thay đổi chưa lưu hay không
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Cập nhật trạng thái hasUnsavedChanges khi có thay đổi
  useEffect(() => {
    if (questions.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [questions]);
  
  // Hiển thị cảnh báo khi người dùng rời trang mà chưa lưu
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?";
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    (async () => {
      await detailSubject(params.id);
      await getSubjectQuestions(params.id);
    })();
  }, []);

  // Hiệu chỉnh để đảm bảo mỗi câu hỏi có giá trị canUpdate được thiết lập đúng
  useEffect(() => {
    const storedQuestionsForSubject = storedQuestions[params.id] ?? [];
    
    // Lấy danh sách câu hỏi và thiết lập canUpdate
    const fetchAnswersAndUpdateQuestions = async () => {
      // Tạo bản sao cho danh sách câu hỏi và thêm thuộc tính canUpdate
      const questionsWithCanUpdate = await Promise.all(storedQuestionsForSubject.map(async (q) => {
        let questionCanUpdate = !!q.content.trim();
        let questionAnswers: TStateSubjectAnswer[] = [];
        
        // Nếu là câu hỏi trắc nghiệm, cần kiểm tra câu trả lời
        if (q.type === "MultipleChoice" && q.id) {
          // Lấy danh sách câu trả lời cho câu hỏi
          console.log(q);
          
          await getSubjectAnswers(q.id);
          const qAnswers = subjectAnswersStore?.subjectAnswers?.[q.id as keyof typeof subjectAnswersStore.subjectAnswers];
          const answers = Array.isArray(qAnswers) ? qAnswers : [];
          
          // Chuyển đổi câu trả lời sang định dạng phù hợp
          questionAnswers = answers.map((a: TSubjectAnswer) => ({
            ...a,
            canUpdate: !!a.content.trim()
          }));
          
          // Kiểm tra điều kiện hợp lệ cho câu hỏi trắc nghiệm
          if (questionAnswers.length > 1) {
            const hasCorrectAnswer = questionAnswers.some(
              a => a.isCorrect && !!a.content.trim()
            );
            questionCanUpdate = questionCanUpdate && hasCorrectAnswer;
          } else {
            questionCanUpdate = false; // Không đủ câu trả lời
          }
        }
        
        // Trả về câu hỏi đã được cập nhật
        return {
          ...q,
          answers: questionAnswers,
          canUpdate: questionCanUpdate
        } as TStateSubjectQuestion;
      }));
      
      setQuestions(questionsWithCanUpdate);
      
      // Kiểm tra lại canUpdate tổng thể
      const allCanUpdate = questionsWithCanUpdate.length > 0 && 
                          questionsWithCanUpdate.every(q => q.canUpdate);
      setCanUpdate(allCanUpdate);
    };
    
    fetchAnswersAndUpdateQuestions();
  }, [storedQuestions[params.id], params.id]);
  
  // Reset currentPage về 1 khi load lại danh sách câu hỏi gốc
  useEffect(() => {
    setCurrentPage(1);
  }, [storedQuestions[params.id], params.id]);

  useEffect(() => {
    if (questionError) {
      toast.error(questionError);
      clearQuestionError();
    }
  }, [questionError]);

  // Khi search hoặc thay đổi số lượng câu hỏi, reset về trang 1 nếu cần
  useEffect(() => {
    // Chỉ reset trang khi có thay đổi lớn về số lượng câu hỏi (như khi load trang)
    // Không reset khi thêm/xóa từng câu hỏi một để tránh tình trạng mất trạng thái
    if (Math.abs(filteredQuestions.length - prevQuestionsLength.current) > 1) {
      setCurrentPage(1);
    } else if (filteredQuestions.length < prevQuestionsLength.current) {
      // Nếu số câu hỏi giảm (do xóa), kiểm tra xem trang hiện tại có còn hợp lệ không
      const maxPage = Math.max(1, Math.ceil(filteredQuestions.length / pageSizeNum));
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    }
  }, [filteredQuestions.length, currentPage, pageSizeNum]);

  const handleCancel: MouseEventHandler<HTMLButtonElement> = async () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm("Bạn có thay đổi chưa lưu. Bạn có chắc chắn muốn rời khỏi trang này?");
      if (!confirmLeave) {
        return;
      }
    }
    router.push("/editor/dashboard");
  };

  // Handler update question (theo id thực tế trong mảng gốc)
  const handleUpdatequestion: UpdateItemHandler = useCallback(
    (id, question) => {
      setQuestions((prev) => {
        const idx = prev.findIndex((q) => q.id?.toString() === id?.toString());
        if (idx === -1) return prev;
        const newQs = [...prev];
        newQs[idx] = question;
        return newQs;
      });
    },
    []
  );

  // Handler remove question (theo id thực tế trong mảng gốc)
  const handleRemoveQuestion: RemoveItemHandler = useCallback(
    (id) => {
      setQuestions((prev) => {
        const filteredQuestions = prev.filter((q) => q.id?.toString() !== id?.toString());
        
        // Kiểm tra nếu trang hiện tại sẽ trống sau khi xóa
        // thì chuyển về trang trước đó
        if (filteredQuestions.length > 0) {
          const lastPage = Math.ceil(filteredQuestions.length / pageSizeNum);
          
          // Tính toán số câu hỏi còn lại ở trang hiện tại sau khi xóa
          const startIdx = (currentPage - 1) * pageSizeNum;
          const questionsInCurrentPage = filteredQuestions.slice(
            startIdx,
            startIdx + pageSizeNum
          );
          
          // Nếu trang hiện tại trống và không phải trang đầu, chuyển về trang trước
          if (questionsInCurrentPage.length === 0 && currentPage > 1) {
            setTimeout(() => {
              setCurrentPage(currentPage - 1);
            }, 0);
          }
        }
        
        return filteredQuestions;
      });
    },
    [currentPage, pageSizeNum]
  );

  // Handler add question
  const handleAddQuestion: AddItemHandler = useCallback(
    (question) => {
      // Kiểm tra và đảm bảo câu hỏi có thể được thêm hợp lệ
      const isValid = !!question.content.trim();
      const isEssay = question.type === "Essay";
      
      // Đảm bảo có thuộc tính canUpdate đúng
      const questionWithUpdatedCanUpdate = {
        ...question,
        // Thêm id tạm thời để dễ dàng tham chiếu
        id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        canUpdate: isValid && (isEssay || (question.answers && question.answers.length > 1 && question.answers.some(a => a.isCorrect)))
      };
      
      setQuestions((prev) => {
        const newQuestions = [...prev, questionWithUpdatedCanUpdate];
        
        // Cập nhật trạng thái canUpdate tổng thể
        setTimeout(() => {
          setCanUpdate(newQuestions.every(q => q.canUpdate));
        }, 0);
        
        return newQuestions;
      });
    },
    []
  );

  // Tự động chuyển sang trang cuối khi thêm câu hỏi mới
  useEffect(() => {
    if (questions.length > prevQuestionsLength.current) {
      // Chỉ chuyển trang khi thêm câu hỏi mới
      const lastPage = Math.ceil(questions.length / pageSizeNum);
      if (currentPage !== lastPage) {
        setCurrentPage(lastPage);
      }
    }
    // Chỉ cập nhật ref sau khi đã xử lý logic chuyển trang
    prevQuestionsLength.current = questions.length;
  }, [questions.length, pageSizeNum, currentPage]);

  // Luôn kiểm tra lại canUpdate mỗi khi questions thay đổi
  useEffect(() => {
    if (questions.length === 0) {
      setCanUpdate(false);
      return;
    }
    const can = questions.every((q) => q.canUpdate);
    setCanUpdate(can);
  }, [questions]);

  // Handler check can update
  const handleCheckCanUpdate: ChangeStateHandler = useCallback(
    (reason, data) => {
      let qs = questions;
      switch (reason) {
        case "add":
          // Kiểm tra câu hỏi mới thêm vào
          break;
        case "update":
          // Kiểm tra sau khi cập nhật câu hỏi
          const can = questions.every((q) => q.canUpdate);
          setCanUpdate(can);
          break;
        case "delete":
          if (!data) return;
          // Kiểm tra sau khi xóa câu hỏi
          qs = questions.filter((q) => q.id?.toString() !== data.key?.toString());
          const canAfterDelete = qs.every((q) => q.canUpdate);
          setCanUpdate(canAfterDelete);
          break;
        default:
          break;
      }
    },
    [questions]
  );

  useEffect(() => {
    if (questions.length > 0) {
      scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions]);

  const handleUpdatePage = async () => {
    try {
      if (!canUpdate) {
        toast.error("Vui lòng kiểm tra lại các câu hỏi và câu trả lời");
        return;
      }
      
      // Xóa tất cả câu hỏi và câu trả lời cũ
      await deleteAllSubjectAnswers(params.id);
      await deleteAllSubjectQuestions(params.id);
      
      // Tạo mảng để chứa các câu trả lời cần tạo mới
      const bulkAnswers = await questions.reduce(async (prev, cur, i) => {
        const { answers: ads, ...qd } = cur;
        
        // Tạo câu hỏi mới
        const nq = await createSubjectQuestion({ ...qd, idx: i });
        if (!nq) {
          throw new Error("Lỗi khi tạo câu hỏi");
        }
        
        const d = await prev;
        let answerList: TCreateSubjectAnswer[] = [];
        
        // Nếu là câu hỏi trắc nghiệm, thêm các câu trả lời
        if (qd.type === "MultipleChoice" && ads && ads.length > 0) {
          answerList = ads
            .filter(a => !!a.content.trim()) // Chỉ lấy các câu trả lời có nội dung
            .map(({ id, ...a }, i2) => ({
              ...a,
              subjectQuestionId: nq.id!,
              idx: i2,
            })) as TCreateSubjectAnswer[];
        }
        
        return [...d, ...answerList];
      }, Promise.resolve<TCreateSubjectAnswer[]>([]));
      
      // Tạo các câu trả lời mới nếu có
      if (bulkAnswers.length) {
        await createSubjectAnswers(bulkAnswers);
      }
      
      setHasUnsavedChanges(false);
      toast.success("Cập nhật thành công");
      router.push("/editor/dashboard");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật");
      console.error(error);
    }
  };

  return (
    <div className="h-screen pt-[70px] overflow-y-auto">
      <div className="w-full flex flex-col justify-center items-center ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Quản lý Ngân hàng câu hỏi môn {subjects.get(params.id)?.title}
          </h1>
        </div>
        {!isLoading ? (
          <CardExam className="lg:w-1/2 md:w-1/3 sm:w-1/3 flex flex-col justify-center items-center ">
            {/* Thông tin về số lượng câu hỏi */}
            <div className="w-full flex justify-between items-center mb-4 px-4">
              <span className="text-sm text-gray-500">
                Tổng số câu hỏi: {questions.length}
              </span>
              <span className="text-sm text-gray-500">
                Đang hiển thị: {((currentPage - 1) * pageSizeNum) + 1} - {Math.min(currentPage * pageSizeNum, questions.length)}
              </span>
            </div>
            
            {/* Hiển thị thông báo nếu không có câu hỏi nào */}
            {paginatedQuestions.length === 0 && (
              <div className="w-full p-4 text-center">
                <p className="text-gray-500">Chưa có câu hỏi nào. Hãy thêm câu hỏi mới!</p>
              </div>
            )}
            
            {/* Danh sách câu hỏi */}
            {paginatedQuestions.map((q, i) => (
              <SubjectQuestion
                onRemoveItem={handleRemoveQuestion}
                onUpdateItem={handleUpdatequestion}
                onChangeState={handleCheckCanUpdate}
                isCreate
                canEdit
                key={q.id || i}
                incrementId={q.id}
                val={q}
              />
            ))}
            
            {/* Chỉ hiển thị form thêm mới ở trang cuối cùng */}
            {currentPage === totalPages && (
              <SubjectQuestion
                isAddItemComponent
                onAddItem={handleAddQuestion}
                canEdit
                isCreate
              />
            )}
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
            <div className="w-full flex justify-between p-2">
              <Button
                customStyle={`order-first cursor-pointer bg-red-500 hover:bg-red-600 rounded-sm p-2 text-center w-24 text-gray-50`}
                text="Quay lại"
                onClick={handleCancel}
              />
              <div className="flex flex-col items-end">
                {!canUpdate && questions.length > 0 && (
                  <p className="text-red-500 text-xs italic mb-1">
                    Vui lòng kiểm tra lại câu hỏi và câu trả lời trước khi cập nhật.
                  </p>
                )}
                <Button
                  customStyle={`order-first ${
                    canUpdate
                      ? "cursor-pointer bg-green-500 hover:bg-green-600"
                      : "cursor-not-allowed bg-gray-400"
                  } rounded-sm p-2 text-center w-24 text-gray-50`}
                  text="Cập nhật"
                  onClick={handleUpdatePage}
                />
              </div>
            </div>
          </CardExam>
        ) : (
          <Spinner />
        )}
        <div ref={scrollBottomRef}></div>
      </div>
    </div>
  );
}

export default DetailSubjectPage;
