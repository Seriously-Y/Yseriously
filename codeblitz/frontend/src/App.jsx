import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HeroSection/HeroSection";
import SpeechRecorder from "./pages/Record";
import ServicesPage from "./pages/Intro";
import MissionSolutionPage from "./pages/Mission";
// import SpeechToText from "./speech";
function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/record" element={<SpeechRecorder />} />
        <Route path="/intro" element={<ServicesPage />} />
        <Route path="/mission" element={<MissionSolutionPage />} />
      </Routes>
      
      
      </BrowserRouter>
      {/* <SpeechToText />   */}
      
    </div>
  );
}

export default App;