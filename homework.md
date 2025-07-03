diff diff : package.json and package-lock.json
what is ~ and ^ (teide and caret )

note
app.get(/.\*fly$/, (req, res) => {
res.send("helloo guys abcd");
});

app.get(/^\/a(bb)+c$/, (req, res) => {
    res.send("helloo guys abcd");
});
app.get(/^\/ab*c$/, (req, res) => {
res.send("helloo guys abcd");
});
app.get("/user/:id", (req, res) => {
console.log( req.params) //http://localhost:3000/user/1
res.send("helloo guys abcd");
});
app.get("/user/:id/:name", (req, res) => {
console.log( req.params) http://localhost:3000/user/:1/:name its print {id:1}
res.send("helloo guys abcd");
});

## middleware

app.get("/user", (req, res,next) => {
console.log( req.params)
console.log("this is the first middleware");
// res.send("helloo guys");
next();
},
(req, res, next)=>{
console.log("this is the second middleware2");
// res.send("helloo guys 2");
next();

},
(req, res,next)=>{
console.log("this is the third middleware3");
// res.send("helloo guys 3");
next();
},
(req, res)=>{
console.log("this is the forth middleware4");
res.send("helloo guys 4");

})

## error in middle were

(req, res,next)=>{
console.log("this is the third middleware3");
// res.send("helloo guys 3");
next();
},
(req, res)=>{
console.log("this is the forth middleware4");
next()

}

## infinity in middle were

(req, res,next)=>{
console.log("this is the third middleware3");
// res.send("helloo guys 3");
next();
},
(req, res)=>{
console.log("this is the forth middleware4")
}

## route handler is res back just a function

## using middleware checking token

## option

app.use("/admin",(req,res,next)=>{
let token ="xyz";

let verified=token==="xyz";
if(!verified){
res.status(401).send("Unauthorized");
}
else{
next();
}
})

## option 2

app.use("/admin",(req,res,next)=>{
let token ="xyz";

    if(token==="xyz"){
        console.log("Token Verified");
        next();
    }
    else{
        console.log("Token not verified");
        res.status(401).send("Unauthorized");
    }

})

## option 3


## new file middleware
const authUser = ((req, res, next) => {
  console.log("authUser middleware");
  const token = "xyz";
  const  authHeader=token==="xyz";
  if(!authHeader){
       res.status(401).send("unauthorized");
  }else{
    console.log("authUser success");
    next();
  }
    
});
module.exports={
    auth,
    authUser
}
## how auth work
const {auth,authUser} =require("./middleware/auth")

app.use("/admin",auth) //auth getting by another file  
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


## error

## instance:  refers to the actual data stored within a database at a specific point in time, as well as the memory structures and processes used to manage that data;
 
 ## model: refers to the logical structure and design that determines how data is organized, stored, and manipulated
 ## schema: defines the logical structure of a database, including tables, columns, data types, and relationships between them

 use:  this function and req handler will run come to our server 
 it work for all route

 handling the req and processing that json data is done by this code 
 