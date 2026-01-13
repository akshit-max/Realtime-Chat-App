import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import {ENV} from "./lib/env.js"
import {app,server} from "./lib/socket.js"


dotenv.config();

// const app = express(); for socket remove this express app now app is coming from socket
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({limit:"5mb"}));// for req.body

// 📌 Analogy (Easy to remember)

// Think of cookies like an ID card in your wallet.

// Backend gives you the ID

// Browser keeps it in wallet

// Every time you go to backend → browser shows ID

// Frontend never touches it

app.use(cors({origin:ENV.CLIENT_URL, credentials:true})); // allow frontend to send cookies to backend

// ----------------------------------------------------------------
app.use(cookieParser()); 
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(
    __dirname,
    "../../frontend/dist"
  );

  app.use(express.static(frontendDistPath));

  app.get("*", (_, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

console.log("NODE_ENV =", process.env.NODE_ENV);

// app.listen(PORT, () => {
server.listen(PORT, () => {  // for socket io
  console.log("Server running on port " + PORT);
  connectDB();
});
