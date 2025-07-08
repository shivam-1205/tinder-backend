const express = require("express");
const userRouter = express.Router();
const User  = require("../model/user");

const { authUser } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const USER_SAFE_DATA = "FirstName LastName PhotoUrl Age Gender Skill";

userRouter.get("/user/request/received", authUser, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", ["FirstName", "LastName", "Skill", "PhotoUrl", "Age", "Gender", "Skill"]); //you can use object also{"FirstName LastName skill" } // we use ref building relation 2 tables

    const data = connectionRequests.map((row) => row.fromUserId);
    res.json({
      message: "Received Connection Requests",
      data,
    });
  } catch (err) {
    res.status(400).send("error:" + err.message);
  }
});

userRouter.get("/user/connection/request", authUser, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const ConnectionRequests = await ConnectionRequest.find({
      $or: [

        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);
    // const data= ConnectionRequests.map((row)=>row.fromUserId);
    const data = ConnectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUserId)) { //fromUserId._id.toString() in both side
        return row.toUserId;
      }
      return row.fromUserId;
    }
    );


    res.json({ data })
  } catch (err) {
    res.status(400).send("error:" + err.message);
  }
});

userRouter.get("/feed", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page= parseInt(req.query.page) || 1; // default to page 1 if not provided
    const limit =parseInt(req.query.limit) || 10; // default to 10 items per page
     limit= limit>50?50:limit; // limit to 50 items per page
    const connectionRequest = await ConnectionRequest.find({
      // find all connection req (send / received)
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select('fromUserId  toUserId')
      // .populate("fromUserId", "FirstName").populate("toUserId", "FirstName");

    hideUserFromFeed = new Set()
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString())
      hideUserFromFeed.add(req.toUserId.toString())
    })
    // console.log("hideUserFromFeed", hideUserFromFeed)
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } }, // $nin is used to exclude these users
        { _id: { $ne: loggedInUser._id } }, // exclude logged in user
      ]
    }).select(USER_SAFE_DATA).skip((page -1)*limit).limit(limit);

    res.status(200).send(users)
  } catch (err) {
    res.status(400).send("error:" + err.message);
  }
})
module.exports = userRouter;
