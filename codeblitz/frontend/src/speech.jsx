import React, { useState, useRef } from "react";

const SpeechToText = () => {
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in your browser. Please use Google Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true; // Enable live feedback
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started...");
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let speechToText = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setTranscript(speechToText);

      // Live analysis for filler words
      if (speechToText.includes("uh") || speechToText.includes("um")) {
        setFeedback("Try to avoid filler words like 'uh' or 'um'.");
      } else if (speechToText.length > 5) {
        setFeedback("Good job, you're speaking clearly!");
      } else {
        setFeedback("Keep speaking, I’m listening...");
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setFeedback(`Error: ${event.error}`);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended.");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      console.log("Speech recognition stopped.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Real-Time AI Interview Checker: Speech</h1>

      <div>
        {!isListening ? (
          <button
            onClick={startSpeechRecognition}
            style={{
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            🎤 Start Speaking
          </button>
        ) : (
          <button
            onClick={stopSpeechRecognition}
            style={{
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ⏹ Stop Speaking
          </button>
        )}
      </div>

      <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
        <h2>Your Answer:</h2>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>{transcript || "Start speaking to see your text here..."}</p>
      </div>

      <div style={{ marginTop: "20px", backgroundColor: "#ffeb3b", padding: "15px", borderRadius: "5px" }}>
        <h2>AI Feedback:</h2>
        <p style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>{feedback || "Feedback will appear as you speak."}</p>
      </div>
    </div>
  );
};

export default SpeechToText;