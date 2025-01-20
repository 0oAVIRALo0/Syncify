const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const app = express();

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
app.use(passport.initialize());

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

const userRouter = require("./src/router/user.router.js");

app.use("/api/v1/users", userRouter);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
