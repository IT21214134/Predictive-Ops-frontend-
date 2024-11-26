import React from "react";
import Air1and2 from "../../public/assets/Air 1and2.png";
import Logo from "../../public/assets/Air Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const handleLogin = async () => {
    router.push("/schedulePage");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="hidden md:flex w-full md:w-1/2 h-full justify-center content-center">
        <div className="w-3/4 h-full flex justify-center content-center">
          <Image
            className="object-contain w-full h-full"
            src={Air1and2}
            alt="Login Image"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center h-full bg-white p-4 md:p-0">
        <div className="max-w-md w-full text-center">
          <div className="mt-4 md:mt-8">
            
            <div className="mt-6 md:mt-8">
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg p-2 text-lg md:text-xl font-semibold text-white shadow-lg"
                style={{ backgroundColor: "#033CAA" }}
                onClick={handleLogin}
              >
                Log In
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
