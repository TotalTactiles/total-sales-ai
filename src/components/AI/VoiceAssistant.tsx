
import React, { useState } from "react";

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleToggle = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const speech = event.results[0][0].transcript;
      setTranscript(speech);
      console.log("User said:", speech);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

  return (
    <div className="p-2 border rounded">
      <button 
        onClick={handleToggle} 
        className={`px-4 py-2 rounded ${listening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
      >
        {listening ? "Stop Listening" : "Start Listening"}
      </button>
      {transcript && (
        <p className="mt-2 text-sm text-gray-600">"{transcript}"</p>
      )}
    </div>
  );
};

export default VoiceAssistant;
