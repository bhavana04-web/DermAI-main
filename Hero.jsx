import React from "react";
import { Typewriter } from "react-simple-typewriter";

const Hero = ({ analyzeRef }) => {
  const scrollToAnalyze = () => {
    if (analyzeRef.current) {
      analyzeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#0A0F1C]">
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -bottom-20 -right-20"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
              AI-Powered Skin Analysis{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                <Typewriter
                  words={["for Everyone", "for Doctors", "for Patients", "for Researchers", "for Dermatologists"]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Advanced artificial intelligence that detects and analyzes skin conditions with medical-grade accuracy in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={scrollToAnalyze}
                className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:opacity-90 transition-opacity font-medium"
              >
                Start Free Analysis
              </button>
              <button
                onClick={() => window.location.href = "/about"}
                className="w-full sm:w-auto bg-white/10 cursor-pointer text-white px-8 py-4 rounded-full hover:bg-white/20 transition-colors font-medium"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
