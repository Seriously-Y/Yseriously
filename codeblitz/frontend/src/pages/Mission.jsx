import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const MissionSolutionPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Mission Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        className="h-80 flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-900 to-black"
      >
        <h1 className="text-5xl font-extrabold mt-10 text-amber-500">Our Mission</h1>
        <p className="text-lg max-w-3xl mt-4 px-6 opacity-80">
          In today’s fast-paced environment, keeping up with critical information during meetings or classes is a constant challenge. Here, we envision a future where technology simplifies this process. Our mission is to transform how you capture and use information, ensuring no detail is missed.
        </p>
      </motion.div>
      
      {/* Solution Section */}
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }}
        variants={fadeIn} 
        className="flex flex-col md:flex-row items-center justify-center py-16 px-8"
      >
        <div className="w-full md:w-1/2 text-center md:text-left px-5">
          <h2 className="text-4xl font-bold text-blue-400">Our Solution</h2>
          <p className="text-lg mt-4 opacity-90">
            We introduce an innovative, AI-powered software designed to revolutionize productivity. Our platform eliminates the stress of manual note-taking by providing real-time transcription and intelligent summarization.
          </p>
        </div>
      </motion.div>
      
      {/* Services Offered Section */}
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }}
        variants={fadeIn} 
        className="flex flex-col md:flex-row items-center justify-center py-16 px-8 bg-gray-900"
      >
        <div className="w-full md:w-1/2 md:text-left px-5">
          <h2 className="text-4xl font-bold text-emerald-400">Services Offered</h2>
          <ul className="text-lg mt-6 space-y-4">
            <li className="flex items-start gap-3">
              <span className="text-emerald-300 text-xl">✔</span>
              <strong>AI-powered note-taking:</strong> Real-time speech-to-text with high accuracy.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-300 text-xl">✔</span>
              <strong>Real-time transcription:</strong> Adapts to multiple speakers and technical terms.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-300 text-xl">✔</span>
              <strong>Intelligent summarization:</strong> Extracts key points, action items, and decisions.
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default MissionSolutionPage;
