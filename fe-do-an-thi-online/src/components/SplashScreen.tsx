import Image from 'next/image';
import { useState } from 'react';
import AuthForm from "./AuthForm";

export default function SplashScreen() {
  const [showForm, setShowForm] = useState(false);
  const [haveAccount, setHaveAccount] = useState(false);


  return (
    <div className="flex h-full">
      {/* Left side */}
      <div className="w-1/2 flex items-center justify-center bg-gray-50 h-full">
        <img src="/images/thi.png" alt="Survey" className="w-full h-full mt-4" />
      </div>

      {/* Right side (Form) */}
      {
        !showForm ? (
          <div className="w-1/2 flex flex-col items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-semibold">Create your Free Account</h2>
            <div className="flex justify-center my-4">
              <button className="flex items-end text-gray-500 text-center"
                onClick={() => {
                  setShowForm(true);
                  setHaveAccount(!haveAccount)
                }} 
              >
                Already have an account?{"   "}
                <p className="text-blue-500 ml-2">Sign In</p>
              </button>
            </div>

            {/* Buttons */}
            <div className="mt-6 w-3/4">
              <button className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center mb-3">
                <div className='flex justify-between w-1/3 items-center'>
                  <img src="/icons/google.png" className="w-5 h-5 mr-2" />
                  Continue with Google
                </div>
              </button>
              <button className="w-full bg-white border border-gray-300 rounded-lg py-2 flex items-center justify-center mb-3">
              <div className='flex justify-between items-center w-1/3 '>
                <img src="/icons/facebook.svg" className="w-5 h-5 mr-2" />
                  Continue with Facebook
                </div>
              </button>
              <div className="text-gray-400 text-center my-2">Or</div>
              <button onClick={() => setShowForm(true)} className="w-full bg-black text-white rounded-lg py-2">
                Continue with Email
              </button>
            </div>
          </div>
        ): (
          <div className='w-1/2 flex items-center justify-center'>
            <AuthForm haveAccount={haveAccount}/>
          </div>
        )
      }
    </div>
  );
}