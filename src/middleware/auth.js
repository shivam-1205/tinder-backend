 const auth = ((req, res, next) => {
  console.log("auth middleware");
  const token = "xyz";
  const  authHeader=token==="xyz";
  if(!authHeader){
       res.status(401).send("unauthorized");
  }else{
    console.log("auth success");
    next();
  }
    
});
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