import React, { useState, useEffect } from "react";
import { Twitter, Facebook, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="w-full md:w-1/2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105">
    <h2 className="text-4xl font-extrabold text-white mb-6">{title}</h2>
    {children}
  </div>
);

const HomePage = () => {
  const [counts, setCounts] = useState({
    experience: 0,
    partners: 0,
    products: 0,
    countries: 0,
    awards: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        experience: Math.min(prev.experience + 1, 11),
        partners: Math.min(prev.partners + 1, 6),
        products: Math.min(prev.products + 3, 7),
        countries: Math.min(prev.countries + 1, 1),
        awards: Math.min(prev.awards + 1, 0),
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center px-6">
      {/* Navbar */}
      <nav className="absolute top-0 w-full flex items-center justify-between p-5 px-10 bg-gray-900 bg-opacity-90 text-white backdrop-blur-md shadow-lg">
        <div className="text-3xl font-semibold  text-red-400">YSeriously</div>
        <div className="flex items-center space-x-4">
          {/* <button className="relative p-2 bg-gray-800 rounded-full">🔔</button>
          <button className="bg-green-500 text-black px-3 py-1 rounded-full">
            💲
          </button>
          <button className="bg-white text-black px-5 py-2 rounded-lg font-medium">
            Get Started
          </button> */}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center mt-20">
        <h1 className="text-9xl md:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 animate-fade-in">
          Transforming Note-Taking
        </h1>
        <p className="text-lg text-gray-200 mt-4 animate-slide-up">
          Revolutionize the way you take notes and engage in meetings
        </p>
        <Link to={"/intro"}>
          <button
            className="relative mt-6 px-8 py-3 text-lg font-semibold text-white rounded-full shadow-xl overflow-hidden bg-gradient-to-r from-purple-500 via-red-500 to-orange-500 
                    hover:from-red-500 hover:via-orange-500 hover:to-yellow-500 
                    transition-all duration-300 ease-out transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-20 blur-md"></span>
            <span className="relative">Learn More</span>
          </button>
        </Link>
      </div>

      {/* Technology Stack Section */}
        {/* Technology Stack Section */}
        <div className="mt-16 w-full flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-10">
        <Section title="Technology Stack">
          <ul className="space-y-4 text-gray-300">
            {[
              { icon: "✍", text: "Speech to Text", color: "text-blue-400" },
              { icon: "👤", text: "NLP", color: "text-amber-400" },
              { icon: "🌍", text: "Translation API", color: "text-green-400" },
              { icon: "🔊", text: "Text to Speech", color: "text-purple-400" }
            ].map(({ icon, text, color }) => (
              <li key={text} className="flex items-center space-x-3 text-xl">
                <span className={`${color} text-4xl`}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Recording Section */}
        <Section title="Start Recording">
          <p className="text-gray-400 mb-4">Ease your learning experience with our AI model.</p>
          <Link to="/record">
            <button className="relative px-6 py-3 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-red-500 to-orange-500 
                               hover:from-orange-500 hover:to-yellow-500 transition-all duration-300 ease-out transform hover:scale-105 shadow-xl">
              Start Recording...
            </button>
          </Link>
        </Section>
      </div>

      {/* Vision Section */}
      <div className="mt-16 w-full flex flex-col md:flex-row justify-center items-center space-x-10">
        <div className="w-full md:w-1/2">
          <h2 className="text-5xl font-extrabold text-red-400 mb-6">Vision</h2>
          <p className="text-3xl font-mono text-gray-300 leading-relaxed">
            Reinventing <br />
            <span className="pl-6">The</span> <br />
            <span className="pl-12 text-red-500 font-bold">ART</span> of <br />
            <span className="pl-24">Note-Taking</span>
          </p>
        </div>
        <Section title="Our Mission">
          <p className="text-gray-300">
            Keeping up with key information during busy meetings is a common struggle. Our solution?
            A revolutionary AI-powered software that enhances your note-taking experience.
          </p>
          <p className="text-gray-300 mt-4">
            <strong>Services Offered:</strong> <br />
            AI-powered note-taking <br />
            Real-time speech-to-text conversion
          </p>
          <Link to="/mission">
            <button className="mt-4 px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300">
              Learn More
            </button>
          </Link>
        </Section>
      </div>

      
      {/* Numbers Section */}
      <div className="mt-16 w-full text-center p-10 bg-gray-900 rounded-lg">
        <h2 className="text-3xl font-bold text-white">
          We Take Pride in Our Numbers
        </h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div>
            <h3 className="text-5xl  text-red-400 font-bold">
              {counts.experience}
            </h3>
            <p className="text-gray-300">Hours of Experience</p>
          </div>
          <div>
            <h3 className="text-5xl  text-red-400 font-bold">
              {counts.partners}
            </h3>
            <p className="text-gray-300">Business Partners</p>
          </div>
          <div>
            <h3 className="text-5xl  text-red-400 font-bold">
              {counts.products}
            </h3>
            <p className="text-gray-300">Products Installed</p>
          </div>
          <div>
            <h3 className="text-5xl  text-red-400 font-bold">
              {counts.countries}
            </h3>
            <p className="text-gray-300">Countries Worldwide</p>
          </div>
          <div>
            <h3 className="text-5xl  text-red-400 font-bold">{counts.awards}</h3>
            <p className="text-gray-300">Industry Awards</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-black text-gray-400 py-12 px-6 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl text-red-400 font-bold">YSeriously</h3>
            <p>📞 9535258001</p>
            <p>📧 Yseriously@gmail.com</p>
            <p>🏢 PES University</p>
          </div>

          {["Solutions", "Vision", "Programs"].map((section) => (
            <div key={section} className="space-y-4">
              <h3 className="text-xl text-gray-300">{section}</h3>
            </div>
          ))}

          {/* Social Links */}
          <div className="col-span-1 md:col-span-4 flex justify-between items-center border-t border-gray-800 pt-8">
            <div className="flex items-center space-x-4">
              <h3 className="text-red-400">Follow Us On:</h3>
              {[{ Icon: Linkedin }, { Icon: Facebook }, { Icon: Twitter }].map(({ Icon }, index) => (
                <a key={index} href="#" className="hover:text-red-500 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Global Messenger Icon */}
      {/* <button className="fixed bottom-5 right-5 bg-red-500 p-3 rounded-full shadow-lg hover:bg-red-600 transition">
        💬
      </button> */}
    </div>
  );
};

export default HomePage;
