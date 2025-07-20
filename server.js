// backend/server.js
console.log("PORT from env:", process.env.PORT);
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// הגדרת socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // בשלב מתקדם - להחליף לדומיין שלך
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes (נוסיף בהמשך)
app.get("/", (req, res) => {
  res.send("Chat API is running");
});

// התחברות ל-socket.io
io.on("connection", (socket) => {
  console.log("🟢 User connected: ", socket.id);

  socket.on("message", (data) => {
    console.log("💬 Message received:", data);
    socket.broadcast.emit("message", data); // שולח לכולם חוץ מהשולח
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// הרצת השרת
const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
