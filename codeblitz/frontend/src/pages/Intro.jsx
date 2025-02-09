import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const ServicesPage = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial="hidden" 
        animate="visible" 
        variants={fadeIn} 
        className="h-80 flex flex-col justify-center items-center text-center bg-gradient-to-r from-gray-900 to-black"
      >
        <h1 className="text-5xl font-extrabold text-white-500">Introduction</h1>
        <p className="text-lg text-red-400 mt-2">Our Services</p>
      </motion.div>
      
      {/* Services Section */}
      <div className="flex flex-col items-center py-10 px-5">
        <ServiceCard 
          icon="📄" 
          title="AI-powered Note-Taking" 
          description="Transcribing speech in real-time with high accuracy." 
        />
        <ServiceCard 
          icon="📑" 
          title="Intelligent Summarization" 
          description="Summarizes key points, ensuring nothing important is missed." 
        />
        <ServiceCard 
          icon="🌍" 
          title="Multi-language support" 
          description="Notes are translated and read out in multiple languages for seamless communication." 
        />
      </div>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }}
      variants={fadeIn} 
      className="bg-gray-800 p-6 m-4 w-full max-w-md flex items-center rounded-lg shadow-lg transform hover:scale-105 transition duration-300"
    >
      <span className="text-4xl mr-4 animate-pulse">{icon}</span>
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 mt-1">{description}</p>
      </div>
    </motion.div>
  );
};

export default ServicesPage;
