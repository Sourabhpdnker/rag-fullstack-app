import { useEffect, useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);

      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.log("Upload error:", error);
    }

    setUploading(false);
  };

  // Send message to RAG endpoint
  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      await fetch("http://127.0.0.1:8000/rag/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: input, //
        }),
      });

      setInput("");
      await getMessages(); // refresh full chat
    } catch (error) {
      console.log("Error sending message:", error);
    }

    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">💬 RAG Chat App</h1>
        <p className="text-center text-sm text-blue-100">
          Local AI powered by Ollama
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center mt-20">
              <p className="text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-300 text-sm">
                Ask something to start the conversation
              </p>
            </div>
          )}

          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={index}
                className={`flex mb-4 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-xl ${
                    isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow-md"
                  }`}
                >
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {isUser ? "You" : "Assistant"}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-2">
          Press Enter to send
        </p>
      </div>
      {/* File Upload Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-sm"
          />

          <button
            onClick={uploadFile}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded-lg text-white ${
              uploading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
