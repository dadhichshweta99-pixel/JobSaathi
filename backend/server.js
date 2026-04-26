const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const fetch = require("node-fetch"); // ✅ REST API

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ✅ Debug API key
console.log("API KEY:", process.env.GEMINI_API_KEY);

// ✅ Gemini REST API function
async function getAIResponse(msg) 
{
  const API_KEY = process.env.GEMINI_API_KEY;

  const body = {
    contents: [
      {
        parts: [{ text: `You are a career assistant.\nUser: ${msg}` }],
      },
    ],
  };

  // 🔹 Try primary model
const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-001:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
console.log("Gemini RAW:",data);
  // 🔹 If model not found, fallback
 if (data.error) {
  console.log("Gemini Error:", data.error.message);
  return "AI service not available right now.";
}

  return 
    data.candidates[0].content.parts[0].text ;
   
  
}

  // debug

  


// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ Socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", async (msg) => {
    try {
      console.log("User message:", msg);

      // 👤 show user message
      io.emit("receive_message", {
        sender: "user",
        text: msg,
      });

      // 🤖 AI response
      const aiReply = await getAIResponse(msg);

      console.log("AI reply:", aiReply);

      io.emit("receive_message", {
        sender: "ai",
        text: aiReply,
      });

    } catch (err) {
      console.log("ERROR:", err);

      io.emit("receive_message", {
        sender: "ai",
        text: "AI not responding. Try again.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Start server
server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});