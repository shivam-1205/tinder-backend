const mongoose = require("mongoose");
const validate = require("validator");
const jwt =require("jsonwebtoken")
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 30,
      //   validate(value){
      //     if(!/^[a-zA-Z]+$/.test(value)){
      //         throw new Error("Last name must contain only letters");
      //     }
      //   }
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true,
      validate(value) {
        if (!validate.isEmail(value)) {
          throw new Error("email is not valid");
        }
      },
    },
  password: {
      type: String,
      required: true,
      minLength: 8,
      // validate(value) {
      //     if(validate.isStrongPassword(value)){
      //         throw new Error("Password is not strong");
      //     }
      // },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
  enum:{
    values:["male", "female", "other"],
    message:`{VALUE} is not valid gender type `
  }
      // validate(value) {
      //   if (!["male", "female", "other"].includes(value)) {
      //     throw new Error("gender data is not valid" + value);
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg",


        // https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp
      validate(value) {
        if (!validate.isURL(value)) {
          throw new Error("photoUrl is not valid");
        }
      },
    },
    about: {
      type: String,
      default: "add some info about yourself",
    },
    skill: {
      type: [String],
    },
    location: {
      type: String,
      default: "India",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ email: 1 }, { unique: true });

//  //
//  userSchema.find({FirstName:"shivam", lastName:"singh"})
// index is used to speed up the search query//1 ascending order, -1 descending order
userSchema.index({ firstName: 1, lastName: 1 }, { unique: true });

userSchema.methods.getJWT = async function () {
  const user = this; 

  const token = await jwt.sign({ _id: user._id }, "Devtinder#1205", {
    
  });
  return token;
};

userSchema.methods.validatePassword=async function (passwordInput){
const user=this
const passwordHash=user.password

const isPasswordMatch = await bcrypt.compare(passwordInput, passwordHash);
return isPasswordMatch
}



module.exports = mongoose.model("User", userSchema);
