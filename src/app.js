const express = require('express');

const app = express();

app.use("/",(req, res) => {
    res.send("hello shivam")
});

app.use("/end",(req, res) => {
    res.send("hello shivam")
});


app.use("/about", (req, res) => {    
    res.send("hello hehe")
});


app.listen(3000, () => {
    console.log("server started on port 3000")
}) 

