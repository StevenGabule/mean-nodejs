const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  name: String,
  image: String,
  qty: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Orders", orderSchema);
