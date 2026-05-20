// frontend/src/components/ChatApp.jsx
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { useNavigate } from "react-router-dom";

function ChatApp() {
  const { user, logout } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const navigate = useNavigate();

  // Handle scroll for header effect
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        setScrolled(chatContainerRef.current.scrollTop > 50);
      }
    };
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all messages with authentication
  const getMessages = async () => {
    try {
      const data = await api.get("/chat/");
      setMessages(data);
    } catch (error) {
      console.log("Error getting messages:", error);
      if (error.message === "Unauthorized") {
        logout();
      }
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const clearChat = async () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      try {
        await api.post("/reset-chat/", {});
        setMessages([]);
      } catch (error) {
        console.log("Error clearing chat:", error);
        if (error.message === "Unauthorized") {
          logout();
        }
      }
    }
  };

  const clearKnowledge = async () => {
    if (window.confirm("Are you sure you want to delete all uploaded PDFs?")) {
      try {
        await api.post("/reset-knowledge/", {});
        alert("All uploaded PDFs have been deleted");
      } catch (error) {
        console.log("Error clearing knowledge:", error);
        if (error.message === "Unauthorized") {
          logout();
        }
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const data = await api.postFormData("/upload/", formData);
      console.log("Upload response:", data);

      setUploadProgress(100);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);

      // Show success message
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (error) {
      console.log("Upload error:", error);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message immediately
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      await api.post("/rag/", {
        content: input,
      });

      await getMessages();
    } catch (error) {
      console.log("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, I encountered an error. Please try again.",
        },
      ]);
      if (error.message === "Unauthorized") {
        logout();
      }
    }

    setLoading(false);
    setIsTyping(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-md shadow-lg" : "bg-slate-900/50 backdrop-blur-sm"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all group"
                title="Back to Home"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
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

            <div className="flex items-center gap-3">
              {/* User Email */}
              <div className="text-sm text-purple-300 hidden md:block">
                {user?.email}
              </div>

              {/* Settings Button */}
              <button
                onClick={() => setShowControls(!showControls)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                title="Settings"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                title="Logout"
              >
                <svg
                  className="w-5 h-5 text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Control Panel */}
          {showControls && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex gap-3">
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg transition-all text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Clear Chat
                </button>
                <button
                  onClick={clearKnowledge}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 rounded-lg transition-all text-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                  Clear Knowledge
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className={`flex items-center gap-3 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  file
                    ? "border-green-400 bg-green-500/10"
                    : "border-gray-600 hover:border-purple-400 hover:bg-purple-500/10"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${file ? "bg-green-500/20" : "bg-gray-700"}`}
                >
                  <span className="text-2xl">📄</span>
                </div>
                <div className="flex-1">
                  {file ? (
                    <div>
                      <p className="font-medium text-white">{file.name}</p>
                      <p className="text-xs text-gray-400">
                        {(file.size / 1024).toFixed(0)} KB • Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-300 font-medium">
                        Click to upload a PDF
                      </p>
                      <p className="text-xs text-gray-500">or drag and drop</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <button
              onClick={uploadFile}
              disabled={!file || uploading}
              className={`px-6 py-3 rounded-xl font-medium text-white transition-all min-w-[120px] ${
                uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transform hover:scale-105"
              }`}
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading document...</span>
                <span className="font-medium text-green-400">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {uploadProgress === 100 && (
            <div className="mt-2 text-green-400 text-sm flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              PDF uploaded successfully!
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6" ref={chatContainerRef}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-gray-300 text-lg">No messages yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Upload a PDF and start asking questions!
              </p>
              <div className="flex gap-2 justify-center mt-6 text-xs">
                <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300">
                  📄 PDF support
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300">
                  🤖 RAG powered
                </span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-gray-300">
                  ⚡ Local AI
                </span>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const isUser = message.role === "user";
              const showAvatar =
                index === 0 || messages[index - 1]?.role !== message.role;

              return (
                <div
                  key={index}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2 animate-fadeIn`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {!isUser && showAvatar && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm shadow-md flex-shrink-0">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] group relative ${
                      isUser ? "mr-2" : "ml-2"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isUser
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg"
                          : "bg-white/10 backdrop-blur-sm text-white rounded-bl-none shadow-lg border border-white/20"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <div
                      className={`absolute bottom-0 ${isUser ? "right-0" : "left-0"} opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 mt-1 ${isUser ? "text-right" : "text-left"}`}
                    >
                      {formatTime()}
                    </div>
                  </div>

                  {isUser && showAvatar && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-sm shadow-md flex-shrink-0">
                      👤
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                🤖
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-none shadow-md px-4 py-3 border border-white/20">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-black/30 backdrop-blur-sm border-t border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about your PDF..."
                className="w-full p-4 pr-12 border border-gray-600 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 resize-none bg-gray-800/50 text-white placeholder-gray-500 hover:bg-gray-800/70 transition-all"
                disabled={loading}
                rows="1"
                style={{ minHeight: "56px", maxHeight: "120px" }}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 bottom-4 text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded-full transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className={`px-6 py-4 rounded-2xl font-medium text-white transition-all ${
                loading || !input.trim()
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
              )}
            </button>
          </div>

          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
            <p>Press Enter to send • Shift+Enter for new line</p>
            <p className="text-purple-400">⚡ Local RAG Processing</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
          opacity: 0;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </div>
  );
}

export default ChatApp;
