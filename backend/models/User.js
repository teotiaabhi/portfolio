const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  isActive: Boolean,
});

module.exports = mongoose.model("User", userSchema);
