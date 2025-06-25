import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Analyze from "../components/Analyze";
import Features from "../components/Features";
import FAQ from "../components/FAQ";

const Home = () => {
  const analyzeRef = useRef(null);
  const location = useLocation();

  const scrollToAnalyze = () => {
    analyzeRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-poppins">
      <Navbar scrollToAnalyze={scrollToAnalyze} />
      <Hero analyzeRef={analyzeRef} />
      <div ref={analyzeRef}>
        <Analyze />
      </div>
      <Features />
      <FAQ />
    </div>
  );
};

export default Home;
