import React from "react";
import { MessageCircle } from "lucide-react";

const ChatbotButton = () => {
  const handleClick = () => {
    window.open("https://dermai-bot.zapier.app/", "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-9 right-9 bg-violet-600 hover:bg-violet-700 text-white p-4 rounded-full shadow-lg transition-all duration-500 transform hover:scale-125"
      aria-label="Chat with DermAI Bot"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default ChatbotButton;
