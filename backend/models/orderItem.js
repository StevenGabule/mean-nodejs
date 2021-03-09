const mongoose = require("mongoose");
const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
