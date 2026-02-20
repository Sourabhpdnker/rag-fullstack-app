import { useEffect, useState } from "react";

function App() {
  // State variables - like small storage boxes for our data
  const [messages, setMessages] = useState([]); // Stores all chat messages
  const [input, setInput] = useState(""); // Stores what user types
  const [loading, setLoading] = useState(false); // Tells if message is sending

  // This function gets all messages from the server
  const getMessages = async () => {
    try {
      // Ask server for messages
      const response = await fetch("http://127.0.0.1:8000/chat/");
      const data = await response.json();
      // Save messages in our state
      setMessages(data);
    } catch (error) {
      console.log("Error getting messages:", error);
    }
  };

  // Run getMessages when app starts (like pressing play button)
  useEffect(() => {
    getMessages();
  }, []); // Empty array means run only once

  // This function sends a new message
  const sendMessage = async () => {
    // Don't send empty messages
    if (input === "") {
      return;
    }

    // Show loading spinner
    setLoading(true);

    try {
      // Send message to server
      await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "user",
          content: input,
        }),
      });

      // Clear input box
      setInput("");

      // Get updated messages
      await getMessages();
    } catch (error) {
      console.log("Error sending message:", error);
    }

    // Hide loading spinner
    setLoading(false);
  };

  // This runs when someone presses a key in input box
  const handleKeyPress = (event) => {
    // If they press Enter (key code 13), send message
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    // Main container - takes full screen
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header - top part */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">💬 RAG Chat App</h1>
        <p className="text-center text-sm text-blue-100">Ask me anything!</p>
      </div>

      {/* Messages area - middle part */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {/* Show this if no messages */}
          {messages.length === 0 && (
            <div className="text-center mt-20">
              <p className="text-gray-400 text-lg">No messages yet</p>
              <p className="text-gray-300 text-sm">
                Type something below to start
              </p>
            </div>
          )}

          {/* Show all messages */}
          {messages.map((message, index) => {
            // Different styling for user vs bot messages
            const isUser = message.role === "user";

            return (
              <div
                key={index}
                className={`flex mb-4 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {/* Message bubble */}
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none shadow"
                  }`}
                >
                  {/* Show who sent it */}
                  <p className="text-xs font-bold mb-1 opacity-70">
                    {isUser ? "You" : "Assistant"}
                  </p>

                  {/* Show message content */}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Input area - bottom part */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          {/* Text input box */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            disabled={loading}
          />

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={loading || input === ""}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              loading || input === ""
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {/* Show different text when loading */}
            {loading ? "Sending..." : "Send"}
          </button>
        </div>

        {/* Small helper text */}
        <p className="text-xs text-center text-gray-400 mt-2">
          Press Enter to send message
        </p>
      </div>
    </div>
  );
}

export default App;
