import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqData = [
  {
    question: "How does AI skin lesion detection work?",
    answer:
      "Our AI analyzes uploaded images using a trained deep learning model to identify potential skin conditions with high accuracy.",
  },
  {
    question: "Is the AI diagnosis 100% accurate?",
    answer:
      "While our AI provides highly accurate predictions, it is not a substitute for a professional medical diagnosis. Always consult a dermatologist.",
  },
  {
    question: "Is my uploaded image stored or shared?",
    answer:
      "No, we prioritize privacy. Images are processed in real-time and not stored or shared with third parties.",
  },
  {
    question: "Can I use this for any type of skin lesion?",
    answer:
      "Our AI is trained on multiple types of skin lesions, including melanoma, keratosis, and basal cell carcinoma. However, for uncommon conditions, medical consultation is recommended.",
  },
  {
    question: "Is this service free to use?",
    answer:
      "Yes, our AI-powered skin lesion analysis is free to use. Future premium features may be introduced for advanced insights.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex flex-col items-center py-16 px-4 md:px-10">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-semibold text-white mb-16 text-center"
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="w-full max-w-2xl">
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="mb-4 p-5 rounded-3xl bg-white/5 backdrop-blur-lg shadow-lg"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-white text-lg font-medium focus:outline-none"
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUp size={24} className="transition-transform duration-300" />
              ) : (
                <ChevronDown size={24} className="transition-transform duration-300" />
              )}
            </button>

            <motion.div
              initial={false}
              animate={{ height: openIndex === index ? "auto" : 0, opacity: openIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-white/80 text-sm leading-relaxed mt-2">{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
