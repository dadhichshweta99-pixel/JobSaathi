import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000" ,{
  transports:["websocket"],
});

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("Received:", data); // debug
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
console.log("sending:",message);
    socket.emit("send_message", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      
      <h1 className="text-3xl font-bold mb-6">
        JobSaathi AI 🤖
      </h1>

      <div className="w-full max-w-md bg-gray-900 p-4 rounded-lg shadow-lg">
        
        {/* Chat Box */}
        <div className="h-64 overflow-y-auto mb-4 space-y-2">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white text-right"
                  : "bg-gray-700 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            className="flex-1 p-2 rounded bg-gray-800 outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask career question..."
          />
          <button
            onClick={sendMessage}
            className="bg-white text-black px-4 rounded"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;