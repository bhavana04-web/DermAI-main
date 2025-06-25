import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try { 
      const response = await axios.post("http://localhost:5000/login", { email, password });
      if (response.data.success) {
        const userId = Number(response.data.data.userId);
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify({
          ...response.data.data,
          userId 
        }));
        localStorage.setItem("userId", userId.toString()); 
        
        toast.success("Login successful!");
        navigate("/profile");
      } else {
        toast.error(response.data.message);
      }      
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
      <div className="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-lg backdrop-blur-md w-96">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <LogIn className="w-6 h-6" /> Log In
        </h2>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white/10 text-white rounded-2xl focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white/10 text-white rounded-2xl focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-3 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:bg-blue-700"
          >
            Log In
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Login;