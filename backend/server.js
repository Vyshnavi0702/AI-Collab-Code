const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// Root route to check server status
app.get("/", (req, res) => {
  res.send("AI Collab Backend Running 🚀");
});

const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log("User joined room:", roomId);
  });

  // Chat messages
  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  // Code collaboration
  socket.on("code_change", (data) => {
    socket.to(data.room).emit("receive_code", data.code);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// IMPORTANT: Use Render port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});