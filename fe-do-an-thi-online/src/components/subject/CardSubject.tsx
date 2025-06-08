import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export const CardSubject = ({
  subjectId,
  name,
  description,
}: {
  subjectId: string;
  name: string;
  description?: string;
}) => {
  const router = useRouter();
  const sliceName = name.slice(0, 12) + (name.length > 12 ? "..." : "");

  return (
    <div className="group relative rounded-xl shadow-lg transition-all duration-300 w-full border border-gray-100 dark:border-gray-700 hover:border-primary-100 cursor-pointer hover:shadow-xl bg-white dark:bg-gray-800 overflow-hidden">
      <div className="transition-transform active:scale-[98%]">
        <div className="p-5 pb-3">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {sliceName}
            </h2>
          </div>

          {description && (
            <p className="mt-3 text-sm leading-relaxed line-clamp-2 text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>

        <div className="flex justify-end items-center px-5 py-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => router.push(`/editor/subject/${subjectId}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-md transition-colors"
          >
            Xem thêm
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-100 dark:group-hover:border-primary-400 pointer-events-none rounded-xl transition-all" />
    </div>
  );
};
