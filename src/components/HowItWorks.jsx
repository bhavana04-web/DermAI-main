import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="mt-28 relative bg-[#0A0F1C]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl text-lg mx-auto">
            Three simple steps to get your skin analysis
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take a Photo or Upload",
                description: "Capture a clear image of your skin concern and upload."
              },
              {
                step: "02",
                title: "Upload",
                description: "Upload the image to our secure platform."
              },
              {
                step: "03",
                title: "Get Results",
                description: "Receive instant AI-powered analysis."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: false, amount: 0.2 }} 
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 transform transition-all duration-500 hover:border hover:border-gray-100 group">
                  <span className="text-4xl font-bold text-blue-400 mb-4 block">{step.step}</span>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
