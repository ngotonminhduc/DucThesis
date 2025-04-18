"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { useTestStore } from "@/store/test-store";
import { TTest } from "@/services/testService";
import TestCard from "@/components/card/TestCard";
import { toast } from "react-toastify";

export default function TestDashboard() {
  const router = useRouter();
  const [tests, setTests] = useState<TTest[]>([]);
  const { tests: storedTests, getTests, error, clearError } = useTestStore();

  useEffect(() => {
    (async () => {
      await getTests();
    })();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }
    toast.error(error);
    clearError();
  }, [error]);

  useEffect(() => {
    const d = [] as TTest[];
    storedTests.forEach((t) => {
      d.push(t);
    });
    setTests(d);
  }, [storedTests]);

  const handleDetailTest = (id: string) => {
    router.push(`/result/${id}`);
  };

  return (
    <div className="flex flex-col items-center h-screen pt-[70px] overflow-y-auto ">
      <Header />
      <div className="flex flex-col w-full items-center mt-4 flex-1 ">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 bg lg:w-9/12 pb-3 overflow-x-hidden ">
          {tests.map((test, i) => {
            return (
              <TestCard
                onClick={() => handleDetailTest(test.id)}
                key={i}
                endTime={test.finalAt}
                startTime={test.startAt}
                score={test.score}
                topic={test.exam?.topic ?? ""}
                description={test.exam?.description ?? ""}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
