const mongoose = require("mongoose");
const config = require("../config.json");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Database connected!");
  } catch (err) {
    console.log(err.message);
    //exit with failure
    process.exit(1);
  }
};

module.exports = connectDB;