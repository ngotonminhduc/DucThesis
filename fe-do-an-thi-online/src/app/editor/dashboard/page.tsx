"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { BottomRightButton } from "@/components/button/BottomRightButton";
import { CardSubject } from "@/components/subject/CardSubject";
import { toast } from "react-toastify";
import { useSubjectStore } from "@/store/subject-store";
import { useModal } from "@/hooks/useModal";
import { EmptySubjectState } from "@/components/subject/EmptySubjectState";

export default function EditorDashboard() {
  const router = useRouter();
  const { subjects, getSubjects, error, clearError } = useSubjectStore();

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
    clearError();
  }, [error]);

  return (
    <div className="flex flex-col items-center h-screen pt-[70px] overflow-y-auto">
      <Header />
      {subjects.size > 0 ? (
        <div className="flex flex-col w-full items-center mt-4 flex-1">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:w-9/12 pb-3">
            {Array.from(subjects.values()).map((subject) => (
              <CardSubject
                key={subject.id}
                subjectId={subject.id}
                name={subject.title}
                description={subject.description}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptySubjectState onCreate={() => router.push("/admin/subject/new")} />
      )}
      {subjects.size > 0 && (
        <BottomRightButton onClick={() => {}} />
      )}
    </div>
  );
}
