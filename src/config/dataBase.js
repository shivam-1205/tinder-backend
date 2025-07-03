const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://shivamsinghrajput1205:Shi@tinderdb.mlahvan.mongodb.net/"
  );
};

module.exports = connectDb;
