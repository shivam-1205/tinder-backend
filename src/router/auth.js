const express = require("express");
const authRouter = express.Router();
const {validateSignIn}= require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../model/user");

authRouter.post("/signUp", async (req, res) => {
  try {
    const { FirstName, LastName, Password, Email, Age, Gender, Skill } =
      req.body;
    validateSignIn(req.body);

    const passwordHash = await bcrypt.hash(Password, 10);
    const user = new User({
      FirstName,
      LastName,
      Password: passwordHash, 
      Email,
      Age,
      Gender,
      Skill,
    });
  await user.save();
    
    res.status(200).json({ message: "user created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email });
    if (!user) {
      throw new Error("email is not found");
    }
 //this password is arg to pass another function value
    const isPasswordMatch = await user.validatePassword(Password);
    if (!isPasswordMatch) {
      throw new Error("password not match");
    }
    //get from model/user getJwt and getAuth
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send({ message: "login success" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/logout",async(req,res)=>{
      // res.clearCookie("token").status(200).send({ message: "logout success" });
      res.cookie("token",null,{
        expires: new Date(Date.now())
      }).status(200).send({ message: "logout success" });
})

module.exports=authRouter;