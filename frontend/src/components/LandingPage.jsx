// frontend/src/components/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

function LandingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg animate-bounce">
              📚
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                PDF Chat Assistant
              </h1>
              <p className="text-xs text-purple-300">
                Powered by RAG Technology
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition"
            >
              Features
            </a>
            <a
              href="#tech-stack"
              className="text-gray-300 hover:text-white transition"
            >
              Tech Stack
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-white transition"
            >
              How It Works
            </a>
            <a
              href="#use-cases"
              className="text-gray-300 hover:text-white transition"
            >
              Use Cases
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-purple-300 hidden sm:block">
              👋 {user?.username}
            </span>
            <button
              onClick={() => navigate("/chat")}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md"
            >
              Launch App →
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-purple-500/20 rounded-full mb-6 backdrop-blur-sm">
            <span className="text-purple-300 text-sm">
              🚀 Next-Generation Document Intelligence
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Chat With Your PDFs
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Like Never Before
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform static documents into interactive conversations using
            <span className="text-purple-400 font-semibold">
              {" "}
              Retrieval-Augmented Generation (RAG)
            </span>
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => navigate("/chat")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Start Chatting Now
            </button>
            <a
              href="#features"
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-gray-400 text-sm">Privacy Guaranteed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Local</div>
              <div className="text-gray-400 text-sm">Data Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Real-time</div>
              <div className="text-gray-400 text-sm">Responses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Open Source</div>
              <div className="text-gray-400 text-sm">Technology</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        id="features"
        className="relative py-20 px-6 bg-black/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-300 text-lg">
              Enterprise-grade features with privacy-first approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                🔒
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                100% Privacy Focused
              </h3>
              <p className="text-gray-400">
                Unlike ChatGPT or Claude, your documents NEVER leave your
                computer. All processing happens locally on your machine.
              </p>
              <div className="mt-4 text-sm text-purple-400">
                ✓ No cloud uploads
              </div>
              <div className="text-sm text-purple-400">
                ✓ Your data stays yours
              </div>
              <div className="text-sm text-purple-400">
                ✓ GDPR compliant by design
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                RAG Architecture
              </h3>
              <p className="text-gray-400">
                Uses advanced Retrieval-Augmented Generation to provide
                accurate, context-aware answers from your documents.
              </p>
              <div className="mt-4 text-sm text-purple-400">
                ✓ Semantic search
              </div>
              <div className="text-sm text-purple-400">
                ✓ Contextual understanding
              </div>
              <div className="text-sm text-purple-400">✓ Citation ready</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Blazing Fast
              </h3>
              <p className="text-gray-400">
                Get instant answers from your documents without waiting for
                cloud processing or API calls.
              </p>
              <div className="mt-4 text-sm text-purple-400">
                ✓ Real-time responses
              </div>
              <div className="text-sm text-purple-400">✓ No latency issues</div>
              <div className="text-sm text-purple-400">✓ Offline capable</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              How RAG Technology Works
            </h2>
            <p className="text-gray-300 text-lg">
              Understanding the magic behind the scenes
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                📄
              </div>
              <h3 className="text-white font-semibold mb-2">1. Upload PDF</h3>
              <p className="text-gray-400 text-sm">
                Your document is stored locally
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                🔍
              </div>
              <h3 className="text-white font-semibold mb-2">
                2. Vector Search
              </h3>
              <p className="text-gray-400 text-sm">
                Semantic search finds relevant content
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                🧠
              </div>
              <h3 className="text-white font-semibold mb-2">
                3. AI Processing
              </h3>
              <p className="text-gray-400 text-sm">
                Ollama generates intelligent answers
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg">
                💬
              </div>
              <h3 className="text-white font-semibold mb-2">4. Get Response</h3>
              <p className="text-gray-400 text-sm">
                Accurate answers from your document
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* vs Traditional APIs */}
      <div className="relative py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            How We're Different
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-8 border border-red-500/30">
              <h3 className="text-2xl font-bold text-red-400 mb-4">
                ❌ Traditional APIs
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Your data sent to external servers</li>
                <li>• Privacy concerns with sensitive documents</li>
                <li>• Monthly subscription fees</li>
                <li>• Internet connection required</li>
                <li>• Rate limits & API quotas</li>
                <li>• Data used for training</li>
              </ul>
            </div>

            <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-8 border border-green-500/30">
              <h3 className="text-2xl font-bold text-green-400 mb-4">
                ✅ Our RAG Solution
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Your data stays 100% local</li>
                <li>• Complete privacy & security</li>
                <li>• Free & open source</li>
                <li>• Works offline</li>
                <li>• No limits or restrictions</li>
                <li>• You own your data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div id="use-cases" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Perfect For</h2>
            <p className="text-gray-300 text-lg">
              Real-world applications of our technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-3xl mb-3">🎓</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Students & Researchers
              </h3>
              <p className="text-gray-400 text-sm">
                Quickly extract insights from research papers, textbooks, and
                academic documents
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Business Professionals
              </h3>
              <p className="text-gray-400 text-sm">
                Analyze contracts, reports, and confidential documents securely
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <div className="text-3xl mb-3">⚖️</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Legal & Compliance
              </h3>
              <p className="text-gray-400 text-sm">
                Review legal documents without exposing sensitive information
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div id="tech-stack" className="relative py-20 px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Built With Modern Technology
            </h2>
            <p className="text-gray-300 text-lg">
              Cutting-edge tools for maximum performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">🐍</div>
                <div className="font-semibold text-white">FastAPI</div>
                <div className="text-xs text-gray-400">Backend Framework</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">⚛️</div>
                <div className="font-semibold text-white">React</div>
                <div className="text-xs text-gray-400">Frontend Library</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">🎨</div>
                <div className="font-semibold text-white">Tailwind CSS</div>
                <div className="text-xs text-gray-400">Styling</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">🗄️</div>
                <div className="font-semibold text-white">SQLite</div>
                <div className="text-xs text-gray-400">Database</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">🤖</div>
                <div className="font-semibold text-white">Ollama</div>
                <div className="text-xs text-gray-400">Local LLM</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">📊</div>
                <div className="font-semibold text-white">ChromaDB</div>
                <div className="text-xs text-gray-400">Vector Database</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">🔐</div>
                <div className="font-semibold text-white">JWT</div>
                <div className="text-xs text-gray-400">Authentication</div>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition">
                <div className="text-4xl mb-2">🐳</div>
                <div className="font-semibold text-white">Docker Ready</div>
                <div className="text-xs text-gray-400">Container Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Documents?
            </h2>
            <p className="text-blue-100 mb-8">
              Join the privacy-first document intelligence revolution
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-black/50 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  📚
                </div>
                <span className="text-white font-bold">PDF Chat Assistant</span>
              </div>
              <p className="text-gray-400 text-sm">
                Intelligent document conversation powered by RAG technology.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#tech-stack" className="hover:text-white transition">
                    Technology
                  </a>
                </li>
                <li>
                  <a href="#use-cases" className="hover:text-white transition">
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    GDPR Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>
              © 2024 PDF Chat Assistant. Built with ❤️ using RAG Technology.
              Your data never leaves your device.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <span className="text-purple-400">🔒 Privacy First</span>
              <span className="text-purple-400">🚀 Open Source</span>
              <span className="text-purple-400">💯 Free Forever</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
