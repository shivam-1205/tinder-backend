const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Correct CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Optional: handle preflight requests manually (only if needed)


// Global middleware
app.use(express.json());
app.use(cookieParser());

// Routers
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const userRouter = require("./router/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// DB Connection and server start
const connectDb = require("./config/dataBase");

connectDb()
  .then(() => {
    console.log("connected to db");
    app.listen(7777, () => {
      console.log("server started on port 7777");
    });
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });
