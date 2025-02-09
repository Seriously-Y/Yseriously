import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, RotateCcw, Mic } from "lucide-react";
import { jsPDF } from "jspdf";

const SpeechRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState("en-US"); // State for language selection
  const recognitionRef = useRef(null);
  const API_KEY = "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";

  const initializeSpeechRecognition = () => {
    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error("Speech Recognition not supported");
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        setTranscript(currentTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Error: ${event.error}. Please try again.`);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current.start();
        }
      };
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    initializeSpeechRecognition();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError("");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!recognitionRef.current) {
        initializeSpeechRecognition();
      }
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (error) {
      setError("Error accessing microphone. Please grant permissions.");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    stopRecording();
    setTranscript("");
    setSummary("");
    setError("");
  };

  const summarizeText = async () => {
    if (!transcript.trim()) return;
    setSummary("Summarizing...");
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Summarize the following text into bullet points:" },
            { role: "user", content: transcript },
          ],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      setSummary(data.choices[0].message.content || "Could not summarize.");
    } catch (error) {
      setSummary("Error summarizing text.");
    }
  };

  const generatePDF = () => {
    if (!summary.trim()) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("AI Speech Summary", 20, 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(summary, 20, 40, { maxWidth: 170 });
    doc.save("Speech_Summary.pdf");
  };

  const speakSummary = () => {
    if (!summary.trim()) return;
    const speech = new SpeechSynthesisUtterance(summary);
    speech.lang = language;
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500 mb-12">
        AI Speech Recorder
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Recording Section */}
        <div className="bg-gray-900/50 rounded-xl p-8 backdrop-blur-md shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <div className="flex flex-col items-center space-y-8">
            <div
              className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isRecording ? "animate-pulse bg-red-500" : "bg-gray-700"
              }`}
            >
              <Mic className="w-16 h-16 text-white" />
            </div>
            <p
              className={`text-lg font-semibold ${
                isRecording ? "text-red-400" : "text-gray-300"
              }`}
            >
              {isRecording ? "Recording..." : "Ready to record"}
            </p>
            <div className="w-full flex items-center justify-between px-6">
              <button
                className="text-gray-400 hover:text-white"
                onClick={resetRecording}
              >
                New
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-5 rounded-full transition duration-300 transform ${
                  isRecording ? "bg-gray-700" : "bg-red-500 hover:scale-105"
                }`}
              >
                {isRecording ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              <button className="text-gray-400 hover:text-white" onClick={resetRecording}>
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-gray-800/60 rounded-xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Summarized Notes</h2>
          <div className="min-h-[300px] p-4 bg-gray-900/50 rounded-lg overflow-auto">
            {summary ? (
              <p className="text-gray-200 leading-relaxed">{summary}</p>
            ) : (
              <p className="text-gray-400 italic">Click the summarize button</p>
            )}
          </div>
          <div className="flex flex-col items-center space-y-4">
  <button
    className="w-52 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-blue-400/50 hover:scale-105 transition-transform duration-300 border border-blue-400/50 backdrop-blur-md mt-2"
    onClick={summarizeText}
  >
    🔍 Summarize
  </button>

  <button
    className="w-52 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-green-400/50 hover:scale-105 transition-transform duration-300 border border-green-400/50 backdrop-blur-md"
    onClick={generatePDF}
  >
    📄 Download PDF
  </button>
</div>

        </div>

        {/* Speech Output Section */}
        <div className="bg-gray-800/60 rounded-xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Speech Output</h2>
          <div className="min-h-[300px] p-4 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">Click below to hear the summarized speech.</p>
            <div className="mt-4">
            <select
  className="w-56 px-4 py-3 bg-gray-800 text-white text-lg font-semibold rounded-xl shadow-lg border border-gray-600/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-500 transition-all duration-300"
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
>
  <option value="en-US">🌎 English (US)</option>
  <option value="en-GB">🇬🇧 English (UK)</option>
  <option value="es-ES">🇪🇸 Spanish</option>
  <option value="fr-FR">🇫🇷 French</option>
</select>
            </div>
            <button
  className="w-52 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-yellow-400/50 hover:scale-105 transition-transform duration-300 border border-yellow-400/50 backdrop-blur-md flex items-center justify-center space-x-2 mt-5"
  onClick={speakSummary}
>
  🔊 <span>Play Speech</span>
</button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechRecorder;