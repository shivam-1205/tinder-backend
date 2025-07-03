const express = require("express");
const { authUser } = require("../middleware/auth");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User=require("../model/user");
const {validateEditProfile,validateSignIn}=require("../utils/validate")

profileRouter.get("/profile/view", authUser, async (req, res) => {
  try {
    const user = req.user;
    
    res.send(user);
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});

profileRouter.patch("/profile/edit",authUser,async(req,res)=>{
  try{
    if(!validateEditProfile(req)){
      throw new Error("Invalid Edit Request")
     }

     const user=req.user;
     const userId=user._id
     if(!userId){
      throw new Error("user ID not  found")
     }
     const userData=req.body
    //  Object.keys(req.body).forEach((key)=>userData([key]=(req.body[key])))
    //userData.save()
   const updatedUser= await User.findByIdAndUpdate({_id:userId},userData,{
    new:true, runValidators:true
   })
   
   if (!updatedUser) {
    throw new Error("user not found");
  }
  res.status(200).json({massage:`${updatedUser.FirstName}: You Profile updated successfully`
  ,Data:updatedUser});
} catch (err) {
  res.status(400).send("error: " + err.message);
}
});


profileRouter.patch("/profile/password", authUser, async (req, res) => {
  try {
    const userId = req.user._id;
    // Validate input and extract password
    // make sure your validator returns an object with `password`
    const password=req.body
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update password in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { Password: hashedPassword },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("Password not updated");
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid password update request" });
  }
});


module.exports=profileRouter;