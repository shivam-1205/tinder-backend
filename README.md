"# tinder-backend" 

app.get("/user", async (req, res) => {
  const name = req.body.FirstName;
  try {
    await User.findOne({ FirstName: name }).then((user) => {
      if (user.length == 0) {
        res.status(404).send("user not found");
      } else {
        res.status(200).send(user);
      }
    });
  } catch (err) {
    res.status(500).send("error finding user");
  }
});

app.get("/feed", async (req, res) => {
  try {
    await User.find({}).then((user) => {
      if (user.length == 0) {
        res.status(404).send("user not fond");
      } else {
        res.status(200).send(user);
      }
    });
  } catch (err) {
    res.status(500).send("error finding user");
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { FirstName, LastName, Password, Email, Age, Gender, Skill } =
      req.body;
    // validate the request body
    validateSignIn(req.body);

    // hash the password 
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

    res.status(200).send("user created" + user);
  } catch (err) {
    res.status(500).send("error: " + err.message);
  }
});

app.get("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email: Email });

    if (!user) {
      throw new Error("invalid credentials");
    }
    // check if the password is correct
    // compare the password with the hashed password
   

    const isStrongPassword = await bcrypt.compare(Password, user.Password);

    if (isStrongPassword) {
      // create a token
      // sign the token with the user id
      const token = await jwt.sign({ _id: user._id }, "Devtinder#1205");
      // set the token in the cookie shared with the profile and all
      res.cookie("token", token);
      res.send("user Logged in successfully");
    } else {
      res.status(500).send("invalid credentials");
    }
  } catch (err) {
    res.status(500).send("error:" + err.message);
  }
});

app.get("/profile",authUser, async (req, res) => {
  const user = req.user;
  // get the token from the cookie
  // check if the token is present
  // verify the token  passed token and secret key
  // get a user id from the token

  res.send(user);
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const userData = req.body;
  console.log(userData);
  // only allow these fields to be updated
  const allowedFields = [
    "userId",
    "Skill",
    "Location",
    "About",
    "PhotoUrl",
    "Gender",
    "Age",
  ];

  try {
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      allowedFields.includes(key)
    );
    
    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid update fields");
    }
    await User.findByIdAndUpdate({ _id: userId }, userData, {
      runValidators: true,
      returnDocument: "after",
      new: true,
    }).then((user) => {
      if (user == 0) {
        res.status(404).send("user not found" + err.message);
      } else {
        res.status(200).send(user);
      }
    });
  } catch (err) {
    res.status(500).send("error updating user" + err.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId).then((user) => {
      if (user == 0) {
        res.status(404).send("user not found");
      } else {
        res.status(200).send(user);
      }
    });
  } catch (err) {
    res.status(500).send("error deleting user");
  }
});


app.delete("/user", authUser, async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;
    if (!userId) {
      throw new Error("user not found");
    }
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      throw new Error("user not found");
    }
    res.status(200).json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(400).send("error: " + err.message);
  }
});



requestRouter.patch("/user",authUser,async(req,res)=>{
    try{
       const user=req.user;
       const userId=user._id;
       if(!userId){
        throw new Error("userID not found")
       }
       const userData=req.body;
       const allowedFields = [
        "userId",
        "FirstName",
        "LastName",
        "Password",
        "Age",
        "Gender",
        "Skill",
      ];
      const isUpdateAllowed= await Object.keys(req.body).every((key=>allowedFields.includes(key)))
      if (!isUpdateAllowed) {
        throw new Error("Invalid update fields");
      }

      const updatedUser=await  User.findByIdAndUpdate({_id:userId} ,userData,
        { new: true, runValidators: true }
      )
      if (!updatedUser) {
        throw new Error("user not found");
      }
      res.status(200).json({ message: "user updated successfully" });
    } catch (err) {
      res.status(400).send("error: " + err.message);
    }
})

module.exports=requestRouter;


