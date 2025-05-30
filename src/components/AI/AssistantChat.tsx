
import React, { useState, useEffect, useRef } from "react";

const AssistantChat = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (msg: string) => {
    setMessages((prev) => [...prev, { text: msg, sender: "user" }]);
    try {
      // Mock AI response for now - replace with actual API call
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "I'm here to help with your sales workflow!", sender: "ai" }]);
      }, 1000);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "AI is currently unavailable.", sender: "ai" }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current?.value) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    const interval = setInterval(() => setMessages([]), 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white border rounded shadow-md">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((m, i) => (
          <div key={i} className={`my-1 p-2 rounded ${m.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-100"}`}>
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-2 border-t flex">
        <input 
          ref={inputRef} 
          type="text" 
          placeholder="Ask AI..." 
          onKeyDown={handleKeyPress} 
          className="flex-1 p-2 border rounded mr-2" 
        />
        <button
          onClick={() => {
            if (inputRef.current?.value) {
              sendMessage(inputRef.current.value);
              inputRef.current.value = "";
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AssistantChat;
