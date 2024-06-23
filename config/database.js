require("dotenv/config");
const mongoose = require("mongoose");

(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION);
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
})();
