const express = require("express");
const router = express.Router();
const Categories = require("../models/category");

router.get("/", async (req, res) => {
  const categories = await Categories.find();
  if (!categories) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const categories = await Categories.findById(id);
  if (!categories) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
  res.send(categories);
});

router.post("/", async (req, res) => {
  const category = new Categories({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  const newCategory = await category.save();
  if (!newCategory) {
    console.log(err);
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.status(201).json(newCategory);
});

router.put("/", async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const updateCategory = await Categories.findByIdAndUpdate(id, {
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  if (!updateCategory) {
    console.log(err);
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.json(updateCategory);
});

router.delete("/", async (req, res) => {
  const id = req.body.id;
  console.log(id);
  const deletedCategory = await Categories.findByIdAndDelete(id);
  if (!deletedCategory) {
    console.log(err);
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  res.json(null);
});

module.exports = router;
