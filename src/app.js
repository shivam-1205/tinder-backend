const express = require("express");
const app = express();
const cors=require("cors");

app.use(cors(
  {
    origin: "http://localhost:5173/",
    credentials: true, // Allow cookies to be sent
  }
))
const connectDb = require("./config/dataBase");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser());


const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const userRouter= require("./router/userRouter")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter )

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
