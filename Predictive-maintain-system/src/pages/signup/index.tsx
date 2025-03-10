import React, { useState } from "react";
import Air1and2 from "../../../public/assets/Air 1and2.png";
import Logo from "../../../public/assets/Air Logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { app, auth, firestore } from "../../../firebaseconfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useRealTimeData } from "../../components/RealTimeDataContext";

function Signup() {
  const router = useRouter();
  const [type, setType] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const { data: realTimeData } = useRealTimeData();

  const checkPassword = (value: any) => {
    setCpassword(value);
    setType(password === value);
  };

  const handleSignup = async () => {
    if (!email || !password || !cpassword) {
      Swal.fire("Error", "All fields are required", "error");
      return;
    }

    if (password !== cpassword) {
      Swal.fire("Error", "Passwords do not match", "error");
      return;
    }

    if (!isChecked) {
      Swal.fire(
        "Error",
        "You must agree to the Terms of Service and Privacy Policy",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "Processing...",
      html: 'Please wait while the data is being processed.<br><div class="spinner-border" role="status"></div>',
      allowOutsideClick: false,
      showCancelButton: false,
      showConfirmButton: false,
    });

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const values = {
        email: email,
        type: "user",
      };

      const Collection = collection(firestore, "user");
      await setDoc(doc(Collection), values);

      Swal.fire("Success", "User added successfully", "success");
      await sessionStorage.setItem("user", values.email);
      await localStorage.setItem("uid", user.uid);
      router.push("/preprocessor");
    } catch (error) {
      Swal.fire("Error", "Email is already used or invalid", "error");
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <div className="hidden lg:flex w-1/2 h-full justify-center items-center bg-white">
        <Image
          className="object-contain w-full h-full"
          src={Air1and2}
          alt="Signup Image"
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center">
          <span
            className="font-bold text-2xl lg:text-4xl"
            style={{ color: "#39B39B" }}
          >
            Create Your Maintenance Account
          </span>
          <div className="mt-4 lg:mt-8">
            <p className="text-xl font-semibold text-gray-700">
              "Join to enable proactive maintenance"
            </p>
            <div className="flex justify-center mt-5">
              <Image src={Logo} alt="Logo" width={60} height={60} />
            </div>

            <div className="relative mt-8">
              <input
                id="email"
                type="email"
                required
                className="block w-full px-3 pt-5 pb-2 rounded-md border shadow-sm placeholder-transparent text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 peer"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute left-3 top-2 text-gray-400 text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:text-indigo-600"
              >
                Email Address
              </label>
            </div>

            <div className="relative mt-8">
              <input
                id="password"
                type="password"
                required
                className="block w-full px-3 pt-5 pb-2 rounded-md border shadow-sm placeholder-transparent text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 peer"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute left-3 top-2 text-gray-400 text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:text-indigo-600"
              >
                Password
              </label>
            </div>

            <div className="relative mt-8">
              <input
                id="cpassword"
                type="password"
                required
                className="block w-full px-3 pt-5 pb-2 rounded-md border shadow-sm placeholder-transparent text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 peer"
                placeholder="Confirm Password"
                value={cpassword}
                onChange={(e) => checkPassword(e.target.value)}
              />
              <label
                htmlFor="cpassword"
                className="absolute left-3 top-2 text-gray-400 text-xs peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:text-indigo-600"
              >
                Confirm Password
              </label>
            </div>

            <div className="flex items-center justify-center mt-10">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <label
                htmlFor="terms"
                className="ml-3 text-sm font-semibold text-gray-700"
              >
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button
              type="button"
              className={`w-full mt-6 p-3 rounded-lg text-white text-lg font-semibold shadow-lg ${
                isChecked ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSignup}
              disabled={!isChecked}
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
