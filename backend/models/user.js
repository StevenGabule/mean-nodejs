const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },

  description: {
    type: String,
    default: null,
  },

  qty: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
