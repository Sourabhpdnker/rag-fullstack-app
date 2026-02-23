import { useEffect, useState, useRef } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all messages
  const getMessages = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chat/");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.log("Error getting messages:", error);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  const clearChat = async () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      await fetch("http://localhost:8000/reset-chat/", {
        method: "POST",
      });
      setMessages([]);
    }
  };

  const clearKnowledge = async () => {
    if (window.confirm("Are you sure you want to delete all uploaded PDFs?")) {
      await fetch("http://localhost:8000/reset-knowledge/", {
        method: "POST",
      });
      alert("All uploaded PDFs have been deleted");
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
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
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
      await fetch("http://127.0.0.1:8000/rag/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: input,
        }),
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
    <div className="h-screen w-screen flex flex-col bg-[#f0f2f5]">
      {/* Header */}
      <div className="bg-[#1a2639] text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              📚
            </div>
            <div>
              <h1 className="text-xl font-semibold">PDF Chat Assistant</h1>
              <p className="text-xs text-blue-200">Powered by Ollama & RAG</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 bg-white/10 rounded-lg transition-all"
              title="Settings"
            >
              <svg
                className="w-5 h-5"
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
          </div>
        </div>

        {/* Control Panel */}
        {showControls && (
          <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-white/10">
            <div className="flex gap-3">
              <button
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-200 rounded-lg transition-all text-sm"
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
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-200 rounded-lg transition-all text-sm"
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

      {/* File Upload Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
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
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${file ? "bg-green-100" : "bg-gray-100"}`}
                >
                  <span className="text-2xl">📄</span>
                </div>
                <div className="flex-1">
                  {file ? (
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(0)} KB • Ready to upload
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-700 font-medium">
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
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg"
              }`}
            >
              {uploading ? "Uploading..." : "Upload PDF"}
            </button>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Uploading document...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {uploadProgress === 100 && (
            <div className="mt-2 text-green-600 text-sm flex items-center gap-1">
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
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-gray-500 text-lg">No messages yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Upload a PDF and start asking questions!
              </p>
              <div className="flex gap-2 justify-center mt-6 text-xs text-gray-400">
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  📄 PDF support
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">
                  🤖 RAG powered
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full">
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
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-md flex-shrink-0">
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
                          ? "bg-blue-500 text-white rounded-br-none shadow-md"
                          : "bg-white text-gray-800 rounded-bl-none shadow-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                    <div
                      className={`absolute bottom-0 ${isUser ? "right-0" : "left-0"} opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                🤖
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none shadow-md px-4 py-3">
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
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question about your PDF..."
                className="w-full p-4 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none bg-gray-50 hover:bg-white transition-all"
                disabled={loading}
                rows="1"
                style={{ minHeight: "56px", maxHeight: "120px" }}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute right-3 bottom-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-all"
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
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105"
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

          <div className="flex justify-between items-center mt-2 text-xs text-gray-400 px-2">
            <p>Press Enter to send • Shift+Enter for new line</p>
            <p className="text-blue-500">⚡ Local AI</p>
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
      `}</style>
    </div>
  );
}

export default App;
