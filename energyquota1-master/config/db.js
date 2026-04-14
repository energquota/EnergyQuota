const mongoose = require("mongoose");
require("dotenv").config();

module.exports = function () {
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
      console.log("Connected to mongodb succefully");
    })
    .catch((err) => {
      console.log(err.message);
    });
};
