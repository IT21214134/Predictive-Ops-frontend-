import Air1and2 from "../../public/assets/Air 1and2.png";
import Logo from "../../public/assets/Air Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../../firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";
import { useRealTimeData } from "../components/RealTimeDataContext";

import React, { useState } from "react";
import { loadBindings } from "next/dist/build/swc";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { data: realTimeData } = useRealTimeData();

  const handlelogin = async () => {
    try {
      console.log(email, password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user: any = userCredential.user;
      console.log(user.email);
      console.log(user.uid);

      if (user) {
        await sessionStorage.setItem("user", user.email);
        await localStorage.setItem("uid", user.uid);
        router.push("/preprocessor");
      }
    } catch (error) {
      console.error("Error signing in:", error);
      Swal.fire("Error", "Login error. Please check your credentials.", "error");
    }
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
          <span
            className="font-bold text-2xl md:text-4xl text-center"
            style={{ color: "#39B39B" }}
          >
            Login to Maintenance
          </span>
          <div className="mt-4 md:mt-8">
            <div className="relative text-center">
              <p className="mt-4 text-lg md:text-xl font-semibold">
                "Predict equipment failures in industrial settings"
              </p>
            </div>
            <div className="flex justify-center mt-4 md:mt-5">
              <Image
                className="object-contain"
                src={Logo}
                alt="Logo"
                width={75}
                height={75}
              />
            </div>

            <div className="relative mt-6 md:mt-10">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block shadow-sm w-full px-3 pt-5 pb-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600 peer sm:text-sm sm:leading-6"
                style={{ backgroundColor: "white" }}
                placeholder="Email Address"
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2 text-gray-400 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:text-indigo-600"
              >
                Email Address
              </label>
            </div>

            <div className="relative mt-6 md:mt-8">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block shadow-sm w-full px-3 pt-5 pb-2 rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder-transparent focus:ring-2 focus:ring-inset focus:ring-indigo-600 peer sm:text-sm sm:leading-6"
                style={{ backgroundColor: "white" }}
                placeholder="Password"
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2 text-gray-400 text-xs transition-all peer-focus:top-2 peer-focus:text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:text-indigo-600"
              >
                Password
              </label>
            </div>

            <div className="flex items-center justify-center mt-6 md:mt-10">
              <input type="checkbox" className="w-4 h-4" required />
              <span className="ml-2 text-sm font-semibold" style={{ color: "#0A5DFF" }}>
                Keep me logged in
              </span>
            </div>

            <div className="mt-6 md:mt-8">
              <button
                type="button"
                className="flex w-full justify-center rounded-lg p-2 text-lg md:text-xl font-semibold text-white shadow-lg"
                style={{ backgroundColor: "#033CAA" }}
                onClick={handlelogin}
              >
                Log In
              </button>
            </div>
            <div className="mt-4 md:mt-6">
              <span className="text-sm md:text-lg font-semibold">
                Don’t have an account?{" "}
                <a
                  href="/signup/"
                  className="font-bold ml-1 hover:text-primary-content"
                  style={{ color: "#0A5DFF" }}
                >
                  Sign Up
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
