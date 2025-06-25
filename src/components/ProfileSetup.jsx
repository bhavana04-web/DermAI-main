import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "";
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      toast.error("User email not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/profile-setup", {
        email: userEmail,
        location,
        age,
      });

      if (response.data.success) {
        toast.success("Profile setup completed!");
        localStorage.setItem("userProfile", JSON.stringify({ location, age }));
        navigate("/profile");
      } else {
        toast.error("Failed to save profile details.");
      }
    } catch (error) {
      toast.error("Something went wrong. Check server logs.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0F1C]">
      <div className="bg-white/10 border border-white/20 p-8 rounded-3xl shadow-lg backdrop-blur-md w-96">
        <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Location"
            className="w-full p-3 bg-white/10 text-white rounded-2xl focus:outline-none"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Age"
            className="w-full p-3 bg-white/10 text-white rounded-2xl focus:outline-none"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full p-3 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:bg-blue-700"
          >
            Save & Continue
          </button>
        </form>
      </div>
      <Toaster/>
    </div>
  );
};

export default ProfileSetup;
