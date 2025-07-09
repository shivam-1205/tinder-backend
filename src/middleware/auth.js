const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authUser = async (req, res, next) => {
      const {token}=req.cookies;
        if(!token){
          return res.status(401).json({message:"Please Login"})
        }
        const isVerified=await jwt.verify(token,"Devtinder#1205")
        const {_id}=isVerified;
        const user=await User.findById(_id);
        if(!user){
          return res.status(401).json({message:"Unauthorized"})
        }
        req.user=user;
        next()
};

module.exports = {
  authUser,
};
