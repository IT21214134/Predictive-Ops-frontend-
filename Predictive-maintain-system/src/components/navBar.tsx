import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("user");
    if (storedEmail) {
      setEmail(storedEmail);
    }
    setActiveLink(router.pathname);
  }, [router.pathname]);

  const handleLogout = async () => {
    if (email) {
      const result = await Swal.fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Log out",
      });
      if (result.isConfirmed) {
        try {
          localStorage.removeItem("uid");
          sessionStorage.removeItem("user");
          Router.push("/");
        } catch (error) {
          console.error("Error during logout:", error);
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  return (
    <div className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {email && (
        <div className="hidden lg:flex space-x-6">
          <ul className="flex space-x-4">
            {[
              { name: "Home", path: "/home" },
              { name: "Schedule Page", path: "/schedulePage" },
              { name: "Predict Page", path: "/predictPage" },
              { name: "Fixing Page", path: "/fix" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-4 py-2 text-lg font-bold rounded transition-colors ${
                    activeLink === item.path
                      ? "bg-blue-700 text-white"
                      : "text-black hover:bg-blue-700 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {email && (
        <div className="flex items-center space-x-4">
          <span className="text-gray-800 font-semibold">{email}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600"
          >
            ▼
          </button>
        </div>
      )}
    </div>
  );
}
