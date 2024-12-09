import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chatter-frontend-39k9.onrender.com", // Correct frontend live URL
    methods: ["GET", "POST"],
  },
});

// Root route to handle GET requests
app.get("/", (req, res) => {
  res.send("Socket.IO server is running!");
});

const users = {};

// Real-time message code
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

// Listen to events on the server-side
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    users[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("disconnect", () => {
    delete users[userId];
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server }; // Export to index.js to start the server
