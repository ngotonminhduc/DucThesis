"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleUser, Bell  } from 'lucide-react';
import Image from "next/legacy/image";
import { logo } from "../../../public";
import InputSearch from "../input/inputSeach";
import UserDropdown from "../userDropdown";

export const Header = () => {
  const router = useRouter();
  const wh_icon_user = 30
  const wh_logo = 70
  return (
    <div className="flex fixed -top-0 items-center w-full justify-between px-36  bg-gray-400">
      <div className="w-1/2">
        <Image src={logo} alt="Survey" width={wh_logo} height={wh_logo}/>
      </div>
      <div className="w-1/2 flex justify-around  ">
        <div className="flex justify-end w-9/12 ">
          <InputSearch onSearch={()=>{}} />
        </div>
        <div className="flex justify-end items-center w-1/4">
          <button 
            onClick={() => {
              localStorage.removeItem("isLoggedIn");
              router.push("/");
            }} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 mr-3"
          >
            <Bell width={wh_icon_user} height={wh_icon_user}/>
          </button>
          <UserDropdown/>
        </div>
      </div>
    </div>
  );
}
