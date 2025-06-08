import { Button } from "../button/Button";

export const EmptySubjectState = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Chưa có môn học nào</h2>
        <p className="text-muted-foreground">
          Bắt đầu bằng cách tạo môn học mới
        </p>
      </div>
      <Button text="Tạo môn học mới" onClick={onCreate} />
    </div>
  );
};
