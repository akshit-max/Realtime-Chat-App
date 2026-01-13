import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

// ------------------------------------------here we try to create our server-----------------------------------
// create app instance again
const app = express();

// create server
const server = http.createServer(app);

// create io on the top of the server and backend
const io = new Server(server, {
  // for authenticate our socket client as well

  // for cookies to come from frontend to backend to authentiacte using midleware
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});


// -------------------------------------------------------------------------

// apply authentication middleware to all socket connections
// Trick: and now socket act like a new schema 


io.use(socketAuthMiddleware);



// -----------------------------------------------------------------------------
// we will use this function to check if the user is online or not
// for realtime messaging 
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
// -----------------------------------------------------------------------------------



// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  // whenever we listen to event we use socket.on

  // we are using io instead of socket as socket is initialised now

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// export all

export { io, app, server };

// now go to server.js and remove express app and add socket app  + server.listen not app.listen
