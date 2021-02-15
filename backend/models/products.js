const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  short_description: {
    type: String,
    required: true,
  },

  long_description: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  images: [
    {
      type: String,
    },
  ],

  brand: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },

  qty: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
  },

  rating: {
    type: Number,
    default: 0,
  },

  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },

  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Products", productSchema);
