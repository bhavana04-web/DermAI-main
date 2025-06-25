import React from "react";
import { Scan } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-white/10 bg-[#0A0F1C]">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center items-center space-x-2 mb-4">
          <Scan className="w-8 h-8 text-blue-500" />
          <span className="text-white font-bold text-xl">DermAI</span>
        </div>
        <p className="text-gray-400">&copy; 2025 DermAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
