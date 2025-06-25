import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserPlus } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const generateUserId = () => Math.floor(10000 + Math.random() * 90000);

  const handleSignup = async (e) => {
    e.preventDefault();
    const userId = generateUserId();

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        userId,
        name,
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Account created successfully!");
        localStorage.setItem("userEmail", email);
        navigate("/profile-setup");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
      <div className="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-lg backdrop-blur-md w-96">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6" /> Sign Up
        </h2>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 bg-white/10 text-white rounded-2xl focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            Sign Up
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Signup;
