const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const { jwtStrategy, spotifyStrategy } = require("./src/auth");

const app = express();

app.use(cors());
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
//   })
// );

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("jwt", jwtStrategy);
app.use("spotify", spotifyStrategy);
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User connected with socketId: ${socket.id}`);

  socket.on("new message", (data) => {
    console.log("Message received:", data);
    socket.broadcast.emit("new message", "Welcome!");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("send friend request", (data) => {});
});

const userRouter = require("./src/router/user.router.js");

app.use("/api/v1/users", userRouter);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
