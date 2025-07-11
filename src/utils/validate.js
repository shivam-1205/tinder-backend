const validator = require("validator");

const validateSignIn = (user) => {
  const { firstName, lastName, email, password, skill } = user;

  if (!firstName|| !lastName) {
    throw new Error("First name and last name are required");
  }

  if (!/^[a-zA-Z]+$/.test(firstName)) {
    throw new Error("First name must contain only letters");
  } 

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name should be between 4 and 50 characters");
  }

  if (!/^[a-zA-Z]+$/.test(lastName)) {
    throw new Error("Last name must contain only letters");
  }

  if (lastName.length < 4 || lastName.length > 50) {
    throw new Error("Last name should be between 4 and 50 characters");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enough. It must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol."
    );
  }

  if (skill && skill.length > 10) {
    throw new Error("skill length should be less than or equal to 10");
  }
};

const validateEditProfile = (req) => {
  const allowedFields = [
    "userId",
    "firstName",
    "lastName",
    "Password",
    "age",
    "gender",
    "skill",
    "photoUrl",
    "about"
  ];

  const isUpdateAllowed = Object.keys(req.body).every((key) =>
    allowedFields.includes(key)
);
return isUpdateAllowed
};

module.exports = { validateSignIn,validateEditProfile 
};
