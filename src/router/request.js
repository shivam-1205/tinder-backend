const express = require("express");
const { authUser } = require("../middleware/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowStatus = ["ignore", "interested"];
      if (!allowStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type:" + status,
        });
      }
      //user find
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send({ message: "user not Found" });
      }

      // if there have any existing req  
      const existingConnectionReq = await ConnectionRequest.findOne({
        $or: [
    // fromUserId and toUserId are unique pair

          { fromUserId, toUserId },
          // check reverse also 
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionReq) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exist" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName+ " is " + status + " the " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("error:" + err.message);
    }
  }
);


requestRouter.post(
  "/request/review/:status/:reqId",
  authUser,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const {status, reqId} = req.params;
      const allowStatus = ["accepted", "rejected"];
      if (!allowStatus.includes(status)) {
        return res.status(400).json({
          message: "invalid status type:" + status,
        });
      }
      // find the req if its interested
      const connectionReq = await ConnectionRequest.findOne({
        _id: reqId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionReq) {
        return res
          .status(404)
          .send({
            message: "connection request not found",
          });
      }
      //save the status

      connectionReq.status = status;
      const data = await connectionReq.save();
      res.json({
        message:
          loggedInUser.firstName+ " is " + status + " the connection request",
        data,
      });
    } catch (err) {
      res.status(400).send("error:" + err.message);
    }
  }
);

module.exports = requestRouter;
