// socket-server.js
const http = require('http');
const { Server } = require("socket.io");

const httpServer = http.createServer((req, res) => {
  // This basic HTTP server isn't strictly necessary for Socket.IO if not serving files,
  // but it's a common way to set it up.
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO server running');
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow connections from your Next.js dev server
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Listen for chat messages
  socket.on('chat message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg.user}: ${msg.text}`);
    // Broadcast the message to everyone including the sender
    io.emit('chat message', msg); 
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server listening on port ${PORT}`);
}); 