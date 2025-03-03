"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { BottomRightButton } from "@/components/button/BottomRightButton";
import ApiService from "@/utils/api";
import { ItemExam, ListExam, ResponseExams, Status } from "@/utils/type";
import { CardHome } from "@/components/card/CardHome";
import { Modal, ModalButton } from "@/components/modal";
import { toast } from "react-toastify";
import { useGlobalStore } from "@/store/global-store";

export default function Dashboard() {
  const router = useRouter();
  const [ exams, setExams ] = useState<ListExam>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [removeItem, setRemoveItem] = useState<string>('');
  const { statusCreateUpdate, createStatusCreateUpdate, clearStatusCreateUpdate } = useGlobalStore();

  useEffect(() => {
    const getExam = async () => {
      const resExam: ResponseExams = await ApiService.get("/exam/gets");
      setExams(resExam.data.exams)
    }
    getExam()
  },[])

  // Lắng nghe statusCreateUpdate để hiển thị toast
useEffect(() => {
  if (statusCreateUpdate.status) {
    toast.success(statusCreateUpdate.label, {toastId: "update-success",});
    clearStatusCreateUpdate();
  }
}, [statusCreateUpdate, clearStatusCreateUpdate]);

  const onClickItem = (id: string) => {
    router.push(`/admin/exam/${id}`)
  }
  const onRemoveItem = async (id: string) => {

    setRemoveItem(id)
    setIsOpen(true)
    
  }

  const buttons: ModalButton[] = [
    {
      text: 'Cancel',
      onClick: () => setIsOpen(false),
    },
    {
      text: 'Agree',
      onClick: async () => {
        try {
          const deleteExam:any = await ApiService.post("/exam/delete",{id: removeItem});
          const deleteQuestion:any = await ApiService.post("/question/delete",{examId: removeItem});
          const deleteAnswer:any = await ApiService.post("/answer/delete", {examId: removeItem});
          if (deleteExam.success && deleteQuestion.success && deleteAnswer.success) {
            console.log('asfsdfsf');
            toast.success("Exam created successfully!");
            setTimeout(() => {
              location.reload()
            }, 5900);
            setIsOpen(false);
          }
        } catch (error: any) {
          setIsOpen(false);
          toast.error(error.response?.data?.message || "Error creating exam");
        }
      },
    },
  ]

  return (
    <div className="flex flex-col items-center h-screen pt-[70px] overflow-y-auto ">
      <Header/>
      <div className="flex flex-col w-full items-center mt-4 flex-1 ">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg lg:w-9/12 pb-3 overflow-x-hidden ">
        {/* flex-grow */}
          {exams.map((e, index) => (
            <CardHome
              onClick={() => onClickItem(e ? e.id : '')}
              key={index}
              examId={e ? e.id : ''}
              examTime={ e ? e.examTime : 0}
              topic={e ? e.topic : ''}
              status={e ? e.status : 'inactive'}
              description={e ? e.description : ''}
              onRemoveItem={() => onRemoveItem(e ? e.id : '')}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        buttons={buttons}
        exams={exams}
      >
        <h1>Bạn thật sự muốn xóa không?</h1>
      </Modal>
      <BottomRightButton onClick={()=>(router.push('/admin/exam'))}/>
    </div>
  );
}
