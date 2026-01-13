const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

connectDB();

const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Make io accessible globally
app.set("io", io);

// Socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId || socket.handshake.auth.userId;

  if (userId) {
    // Store mapping (using Socket.IO rooms as the map)
    socket.join(userId);
    console.log(`🔌 User connected and joined room: ${userId}`);
  } else {
    console.log("🔌 User connected (no userId)");
  }

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
