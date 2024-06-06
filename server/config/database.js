const mongoose = require("mongoose");
require("dotenv").config;

const databaseConnect = async () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database");
    })
    .catch((error) => {
      console.log("Error connecting to database");
      console.error(error);
    });
};

module.exports = databaseConnect;