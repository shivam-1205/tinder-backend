const express = require('express');
const app = express();
const {auth,authUser} =require("./middleware/auth")

app.use("/admin",auth)
app.use("/user",authUser)


app.get("/user/users",authUser, (req, res) => {
    res.send("user its me")
});


app.get("/user/users/me", (req, res) => {
    res.send("user its me")
})

app.get("/admin/dashboard", (req, res) => {
    res.send("Admin Dashboard");
})
app.get("/admin/deleteAcc", (req, res) => {
    res.send("Admin Delete Account");
})

app.listen(3000, () => {
    console.log("server started on port 3000");
});
