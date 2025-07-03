const express = require("express");
const userRouter = express.Router();

const { authUser } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");

const USER_SAFE_DATA = "FirstName LastName PhotoUrl Age Gender Skill";

userRouter.get("/user/request/received", authUser, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", ["FirstName", "LastName", "Skill", "PhotoUrl" ,"Age", "Gender" ,"Skill"]); //you can use object also{"FirstName LastName skill" } // we use ref building relation 2 tables

    const data= connectionRequests.map((row)=>row.fromUserId);
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
    const data= ConnectionRequests.map((row)=>{
        if(row.fromUserId._id.equals(loggedInUserId)){ //fromUserId._id.toString() in both side
            return row.toUserId;
        }
        return row.fromUserId;
    }
    );


    res.json({data})
  } catch (err) {
    res.status(400).send("error:" + err.message);
  }
});

module.exports = userRouter;
