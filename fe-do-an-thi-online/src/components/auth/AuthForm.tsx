import { ChangeEvent, FormEventHandler, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useGlobalStore } from "@/store/global-store";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { facebook, google, logo } from "../../../public";
import Image from "next/legacy/image";
import { wh_logo, wh_logo_google } from "@/utils/constants";
import ApiService from "@/utils/api";

interface AuthFormProps {
  defaultEmail?: string; // Nhận email mặc định (nếu có)
  haveAccount: boolean;
  onBack?: () => void; // Hàm callback để quay lại màn hình trước
}

export default function AuthForm({ haveAccount }: AuthFormProps) {
  const { login, register } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signIn, setSignIn] = useState(haveAccount);

  const changePassWord = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const changeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const changeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (signIn) {
      login(email, password);
    } else {
      register({ email, password, name });
    }
  };

  return (
    <div className="w-full max-w-lg  p-6 rounded-3xl shadow-2xl">
      <div className="flex justify-center">
        <Image
          src={logo}
          alt="Logo"
          width={wh_logo}
          height={wh_logo}
          className="w-12 h-12 mb-4"
        />
      </div>
      <h2 className="text-2xl font-semibold text-center">
        Create your Free Account
      </h2>
      <div className="flex justify-center my-4">
        <button
          onClick={() => setSignIn(!signIn)}
          className="flex items-end text-gray-500 text-center"
        >
          Already have an account?{"   "}
          <p className="text-blue-500 ml-2">{signIn ? "Sign up" : "Sign In"}</p>
        </button>
      </div>
      <button className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center mb-3">
        <div className="flex justify-around items-center w-1/2">
          <Image src={google} width={wh_logo_google} height={wh_logo_google} />
          <div>Continue with Google</div>
        </div>
      </button>
      <button className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center mb-3">
        <div className="flex justify-around items-center  w-1/2">
          <Image
            src={facebook}
            width={wh_logo_google}
            height={wh_logo_google}
            className="w-5 h-5 mr-2"
          />
          Continue with Facebook
        </div>
      </button>
      <div className="text-gray-400 text-center my-2">Or</div>

      <form className="mt-4" onSubmit={handleSubmit}>
        {!signIn && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="name"
              className="w-full p-2 border rounded mt-1"
              value={name}
              onChange={changeName}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={changeEmail}
            required
          />
        </div>

        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full p-2 border rounded mt-1`}
              value={password}
              onChange={changePassWord}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="text-gray-500" size={20} />
              ) : (
                <Eye className="text-gray-500" size={20} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          {signIn ? "Sign In" : "Sign up"}
        </button>
      </form>

      <p className="text-gray-400 text-center text-xs mt-4">
        By using Reylics you agree to the{" "}
        <a href="#" className="text-blue-500">
          Terms and Conditions
        </a>
      </p>
    </div>
  );
}
