const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const Category = require("../models/category");

router.get("/", async (req, res) => {
  try {
    let filter = {};

    if (req.query.categories) {
      filter = {category: req.query.categories.split(',')};
    }

    const products = await Products.find(filter).populate("category");
    const productCount = await Products.find(filter).countDocuments((count) => count);
    return res.send({ products, count: productCount });
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
    if (!product) return res.status(400).json({message: 'Something went wrong!'})
    return res.send(product);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body)
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid category!!');


    let product = new Products({
      name: req.body.name,
      short_description: req.body.short_description,
      long_description: req.body.long_description,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      qty: req.body.qty,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured
    });

    const newProduct = await product.save();
    if (!newProduct) {
      return res.status(500).send("The product cannot be created!");
    }
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

router.put("/", async (req, res) => {
  const {
    id, name, short_description, long_description, image, images, brand, price,
    category, qty, rating, numReviews, isFeatured
  } = req.body;

  try {
    await Category.findById(category);
  } catch (error) {
    return res
      .status(400)
      .send("Invalid Category or Category is no longer exists.");
  }

  try {
    const updateProduct = { name, short_description, long_description, image, images, brand,
      price, category, qty, rating, numReviews, isFeatured,
    };

    const updatedProduct = await Products.findByIdAndUpdate(id, updateProduct);

    if (!updatedProduct)  return res.status(500).send("The product cannot be updated for some reason!");

    return res.status(201).json(updatedProduct);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    const {id} = req.body;
    await Products.findByIdAndDelete(id);
    return res.json(null);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "The product is no longer exists in the record.",
      success: false,
    });
  }
});

/* featured products*/
router.get('/get/featured/:count', async(req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products  = await Products.find({isFeatured: true}).limit(+count);
    if (!products) return res.status(500).json({message:'Something went wrong'});
    return res.status(200).send(products);
  } catch (e) {
    return res.status(200).send({ message: e.message });
  }
})

module.exports = router;
