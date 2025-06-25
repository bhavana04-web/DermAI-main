import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatbotButton from "./components/ChatbotButton";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProfileSetup from "./components/ProfileSetup";
import Profile from "./components/Profile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnalysisDetail from "./components/AnalysisDetail";
import DoctorPanel from "./components/DoctorPanel";

function AppContent() {
  const location = useLocation();
  
  const hideNavbarAndChatbot = location.pathname === "/login" || 
                              location.pathname === "/signup" || 
                              location.pathname === "/profile-setup";
  
  const hideChatbot = location.pathname === "/profile" || location.pathname === "/doctorpanel" ;
  
  return (
    <>
      {!hideNavbarAndChatbot && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctorpanel" element={<DoctorPanel />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/analysis/:id" element={<AnalysisDetail />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {!hideNavbarAndChatbot && !hideChatbot && <ChatbotButton />}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;