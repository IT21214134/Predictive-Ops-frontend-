import Link from "next/link";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import logo1 from "../../public/assets/Air Logo.png";
import Image from "next/image";

export default function NavBar() {
  const handleClickSchedule = () => {
    Router.push("/schedulePage");
  };

  return (
    <nav className="navbar top-0 left-0 right-0 text-neutral z-50" style={{ backgroundColor: "#033CAA" }}>
      <div className="navbar-start">
        <div className="flex items-center justify-between w-2/3">
            <div className="flex-shrink-0">
              <Image
                src={logo1}
                alt="Logo"
                width={50}
                height={50}
                className="object-contain ms-5"
              />
            </div>
            <div className="">
              <span className="text-lg font-semibold text-white ms-5">Home</span>
              <span className="text-lg font-semibold text-white ms-5">Predicts</span>
              <span className="text-lg font-semibold text-white ms-5" onClick={handleClickSchedule}>Schedule</span>
            </div>
          </div>
      </div>
      
    </nav>
  );
}
