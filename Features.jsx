import React from "react";
import { motion } from "framer-motion";
import { Brain, ShieldCheck, Clock } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-10 h-10 transition-transform duration-500" />,
    title: "Advanced AI Detection",
    description:
      "Our AI model is trained on thousands of dermatological images to provide accurate analysis of skin conditions.",
    hoverColor: "bg-gradient-to-r from-red-600 to-pink-400",
  },
  {
    icon: <ShieldCheck className="w-10 h-10 transition-transform duration-500" />,
    title: "Private & Secure",
    description:
      "Your images are processed securely and never stored without your explicit permission. Your privacy is our priority.",
    hoverColor: "bg-gradient-to-r from-purple-600 to-purple-400",
  },
  {
    icon: <Clock className="w-10 h-10 transition-transform duration-500" />,
    title: "Instant Results",
    description:
      "Get immediate analysis of your skin condition without waiting for appointments or lab results.",
    hoverColor: "bg-gradient-to-r from-green-600 to-green-400",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-12 flex flex-col items-center bg-gradient-to-b from-[#0A0F1C] to-[#05080F]">
      <div className="text-center max-w-2xl">
        <h2 className="text-5xl font-extrabold text-white">Advanced Features</h2>
        <p className="text-lg text-gray-400 mt-4">
          Our AI-powered platform offers cutting-edge technology for skin lesion detection.
        </p>
      </div>

      <div className="mt-12 flex justify-center gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            viewport={{ once: false, amount: 0.2 }} 
            className="w-[400px] p-8 rounded-3xl shadow-sm bg-white/5 border border-gray-900 backdrop-blur-md flex flex-col items-start text-left transform transition-all duration-500 hover:border hover:border-gray-100 group"
          >
            <div className={`${feature.hoverColor} p-4 rounded-3xl shadow-md transition-all duration-500 group-hover:scale-110`}>
              {React.cloneElement(feature.icon, { className: "w-8 h-8 transition-all duration-500 text-white group-hover:rotate-y-360" })}
            </div>
            <h3 className="text-2xl font-semibold text-gray-100 mt-6">
              {feature.title}
            </h3>
            <p className="text-md text-gray-400 mt-2">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
