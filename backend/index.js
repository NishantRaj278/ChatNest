import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import connectDB from "./config/mongoose-connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app } from "./config/socket.js";
dotenv.config();

app.use(
  cors({
    origin: "https://chat-nest-eight.vercel.app",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to ChatNest API");
});

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server running on port ${port}`);
  connectDB();
});
