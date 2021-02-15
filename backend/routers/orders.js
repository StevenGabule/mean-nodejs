const express = require("express");
const router = express.Router();
const Orders = require("../models/order");

router.get(`/`, async (req, res) => {
  const orders = await Orders.find();
  if (!orders) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
  res.send(orders);
});

router.post(`/`, (req, res) => {
  const order = new Orders({
    name: req.body.name,
    image: req.body.image,
    qty: req.body.qty,
  });
  order
    .save()
    .then((p) => {
      res.status(210).json(p);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

module.exports = router;
