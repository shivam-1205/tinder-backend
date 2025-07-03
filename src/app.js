const express = require("express");
const app = express();


const connectDb = require("./config/dataBase");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const requestRouter = require("./router/request");
const userRouter= require("./router/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter )

connectDb()
  .then(() => {
    console.log("connected to db");
    app.listen(3000, () => {
      console.log("server started on port 3000");
    });
  })
  .catch((err) => {
    console.log("error connecting to db", err);
  });
