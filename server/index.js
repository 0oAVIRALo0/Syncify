import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./src/routes/user.routes.js";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User connected with socketId: ${socket.id}`);

  socket.on("client", (args) => {
    console.log(args);
    socket.emit("client", "Welcome!");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api/v1/users", userRouter);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
