"use client";
import { useEffect, useState } from "react";
import { FaCode, FaTools } from "react-icons/fa";
import { GiGears } from "react-icons/gi";
import { MdConstruction } from "react-icons/md";

const Stats = () => {
  const [progress, setProgress] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    "📊 Real-time Analytics",
    "📈 Performance Metrics",
    "🎯 User Insights",
    "⚡ Live Updates",
    "📱 Responsive Dashboards",
    "🔍 Advanced Filtering",
  ];

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 1;
      });
    }, 30);

    // Rotate features text
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(featureInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.1,
            }}
          >
            {i % 2 === 0 ? (
              <FaCode className="text-orange-500 text-xl" />
            ) : (
              <GiGears className="text-purple-500 text-xl" />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="inline-flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-2 rounded-full border border-orange-500/30 mb-6">
              <MdConstruction className="text-orange-400 text-2xl animate-bounce" />
              <span className="text-orange-400 font-semibold">
                Under Development
              </span>
              <FaTools className="text-orange-400 text-xl animate-spin-slow" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
              Stats Hub
            </h1>

            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              We're crafting something amazing to visualize your data and
              insights
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700 mb-8 animate-fadeInUp animation-delay-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-300 font-semibold">
                Development Progress
              </span>
              <span className="text-orange-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-purple-500 h-full rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-3 text-center">
              Launching in {Math.ceil((100 - progress) / 2)} days • Stay tuned!
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
          opacity: 0;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Stats;
