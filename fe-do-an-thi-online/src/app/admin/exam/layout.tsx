import Image from "next/legacy/image";
import { wh_logo_medium } from "@/utils/constants";
import { PropsWithChildren } from "react";
import { logo } from "../../../../public";

export default function ExamAdminLayout({ children }: PropsWithChildren) {
  return (
    <div className="h-screen pt-[70px] overflow-y-auto">
      <div className="flex w-full justify-between fixed -top-0  items-center h-14 px-5 shadow-md mb-5">
        <div>
          <Image
            src={logo}
            alt="Logo"
            width={wh_logo_medium}
            height={wh_logo_medium}
            className="w-12 h-12 mb-4"
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center ">
        {children}
      </div>
    </div>
  );
}
