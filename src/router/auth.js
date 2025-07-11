const express = require("express");
const authRouter = express.Router();
const {validateSignIn}= require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../model/user");

authRouter.post("/signUp", async (req, res) => {
  try {
    const { firstName, lastName, password, email, age, gender, skill } =
      req.body;
    validateSignIn(req.body);

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: passwordHash, 
      email,
      age,
      gender,
      skill,
    });
  await user.save();
    
    res.status(200).json({ message: "user created successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or Password");
    }
 //this password is arg to pass another function value
    const isPasswordMatch = await user.validatePassword(password);
    if (!isPasswordMatch) {
      throw new Error("Invalid email or Password");
    }
    //get from model/user getJwt and getAuth
    const token = await user.getJWT();
    res.cookie("token", token);
    res.send(user);
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