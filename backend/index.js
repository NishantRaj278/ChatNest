import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import connectDB from "./config/mongoose-connection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { server, app } from "./config/socket.js";
dotenv.config();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to ChatNest API");
});

const port = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
