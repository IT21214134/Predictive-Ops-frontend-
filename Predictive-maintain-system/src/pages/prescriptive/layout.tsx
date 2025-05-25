import React from "react";
import NAVBAR from "@/components/navBar";

interface PrescriptiveLayoutProps {
  children: React.ReactNode;
}

const PrescriptiveLayout: React.FC<PrescriptiveLayoutProps> = ({
  children,
}) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NAVBAR />
      {children}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>
          © {new Date().getFullYear()} Machine Monitoring System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default PrescriptiveLayout;
