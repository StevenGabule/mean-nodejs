const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const Category = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const products = await Products.find().populate("category");
    const productCount = await Products.countDocuments((count) => count);
    res.send({ products, count: productCount });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Products.findById(req.params.id).populate("category");
    res.send(product);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    short_description,
    long_description,
    image,
    images,
    brand,
    price,
    category,
    qty,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  try {
    await Category.findById(category);
  } catch (error) {
    return res
      .status(400)
      .send("Invalid Category or Category is no longer exists.");
  }

  const newProduct = {
    name,
    short_description,
    long_description,
    image,
    images,
    brand,
    price,
    category,
    qty,
    rating,
    numReviews,
    isFeatured,
  };

  try {
    const product = await new Products(newProduct).save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  const {
    id,
    name,
    short_description,
    long_description,
    image,
    images,
    brand,
    price,
    category,
    qty,
    rating,
    numReviews,
    isFeatured,
  } = req.body;

  try {
    await Category.findById(category);
  } catch (error) {
    return res
      .status(400)
      .send("Invalid Category or Category is no longer exists.");
  }

  const updateProduct = {
    name,
    short_description,
    long_description,
    image,
    images,
    brand,
    price,
    category,
    qty,
    rating,
    numReviews,
    isFeatured,
  };

  try {
    const updatedProduct = await Products.findByIdAndUpdate(id, updateProduct);
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const id = req.body.id;
    await Products.findByIdAndDelete(id);
    res.json(null);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "The product is no longer exists in the record.",
      success: false,
    });
  }
});

module.exports = router;
