import { useState } from "react";
import Image from "next/legacy/image";
import { facebook, google, logo, thi, thi_onl } from "../../../public";
import AuthForm from "./AuthForm";
import { useWindowSize } from "@/hooks/useWindowSize";
import { wh_logo, wh_logo_google } from "@/utils/constants";
import { AuthType, useAuthStore } from "@/store/auth-store";
import { TSocialLoginType } from "@/services/authService";

interface AuthScreenProps {
  type: AuthType;
}

export default function AuthScreen({ type }: AuthScreenProps) {
  const [showForm, setShowForm] = useState(type !== "default");
  const [haveAccount, setHaveAccount] = useState(type === "login");
  const { height, width } = useWindowSize();
  const { loginWithSocial } = useAuthStore();

  const handleGoogleLogin = async (type: TSocialLoginType) => {
    await loginWithSocial(type);
  };

  return (
    <div className="flex h-full">
      {/* Left side */}
      <div className="w-1/2 flex items-center justify-center">
        <Image
          src={thi_onl}
          priority
          alt="Survey"
          width={width}
          height={height * 2}
        />
      </div>
      {/* Right side (Form) */}
      {!showForm ? (
        <div className="w-1/2 flex flex-col items-center justify-center">
          <Image src={logo} alt="Logo" width={wh_logo} height={wh_logo} />
          <h2 className="text-2xl font-semibold">Create your Free Account</h2>
          <div className="flex justify-center my-4">
            <button
              className="flex items-end text-gray-500 text-center"
              onClick={() => {
                setShowForm(true);
                setHaveAccount(!haveAccount);
              }}
            >
              Already have an account?{"   "}
              <p className="text-blue-500 ml-2">Sign In</p>
            </button>
          </div>

          {/* Buttons */}
          <div className="mt-6 w-3/4">
            <button
              onClick={() => handleGoogleLogin('google')}
              className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center mb-3"
            >
              <div className="flex justify-between w-1/3 items-center">
                <Image
                  src={google}
                  width={wh_logo_google}
                  height={wh_logo_google}
                  className="w-5 h-5 mr-2"
                />
                Tiếp tục với Google
              </div>
            </button>
            <button className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center mb-3">
              <div className="flex justify-between items-center w-1/3 ">
                <Image
                  src={facebook}
                  width={wh_logo_google}
                  height={wh_logo_google}
                  className="w-5 h-5 mr-2"
                />
                Tiếp tục với Facebook
              </div>
            </button>
            <div className="text-gray-400 text-center my-2">Or</div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full bg-black text-white rounded-lg py-2"
            >
              Tiếp tục với Email
            </button>
          </div>
        </div>
      ) : (
        <div className="w-1/2 flex items-center justify-center">
          <AuthForm haveAccount={haveAccount} />
        </div>
      )}
    </div>
  );
}
