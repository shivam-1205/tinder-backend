const validator = require("validator");

const validateSignIn = (user) => {
  const { FirstName, LastName, Email, Password, Skill } = user;

  if (!FirstName || !LastName) {
    throw new Error("First name and last name are required");
  }

  if (!/^[a-zA-Z]+$/.test(FirstName)) {
    throw new Error("First name must contain only letters");
  } 

  if (FirstName.length < 4 || FirstName.length > 50) {
    throw new Error("First name should be between 4 and 50 characters");
  }

  if (!/^[a-zA-Z]+$/.test(LastName)) {
    throw new Error("Last name must contain only letters");
  }

  if (LastName.length < 4 || LastName.length > 50) {
    throw new Error("Last name should be between 4 and 50 characters");
  }

  if (!/\S+@\S+\.\S+/.test(Email)) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(Password)) {
    throw new Error(
      "Password is not strong enough. It must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
    );
  }

  if (Skill && Skill.length > 10) {
    throw new Error("Skill length should be less than or equal to 10");
  }
};

const validateEditProfile = (req) => {
  const allowedFields = [
    "userId",
    "FirstName",
    "LastName",
    "Password",
    "Age",
    "Gender",
    "Skill",
    "PhotoUrl",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedFields.includes(key)
);
return isUpdateAllowed
};

module.exports = { validateSignIn,validateEditProfile 
};
