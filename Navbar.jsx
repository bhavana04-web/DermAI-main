import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Scan, User } from "lucide-react";

const Navbar = ({ scrollToAnalyze }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (location.pathname === "/") {
      scrollToAnalyze(); 
    } else {
      navigate("/"); 
    }
  };

  const handleUserClick = () => {

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-[#0A0F1C]/60 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <Scan className="w-8 h-8 text-blue-500" />
            <Link to="/" className="text-white text-3xl font-bold hover:text-blue-500 transition-colors">
              DermAI
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact Us
            </Link>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition duration-300 hover:scale-110"
            >
              Get Started
            </button>
            
            <button 
              onClick={handleUserClick}
              className="text-gray-300 hover:text-white transition-colors border-2 p-3 rounded-full"
            >
              <User className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
