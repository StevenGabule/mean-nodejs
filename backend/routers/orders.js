const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");

router.get(`/`, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name")
      .sort({ dateOrdered: -1 });
    if (!orders) {
      res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }
    return res.send(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      success: false,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate({
        path: "orderItems",
        populate: { path: "product", populate: "category" },
      });
    if (!order) {
      res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }
    return res.send(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const orderItemIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        const item = await newOrderItem.save();
        return item._id;
      })
    );

    const orderItemsIdResolved = await orderItemIds;

    const totalPrices = await Promise.all(
      orderItemsIdResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        return orderItem.product.price * orderItem.quantity;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

    const order = new Order({
      orderItems: orderItemsIdResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    const newOrder = await order.save();
    return res.status(201).send({ newOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      success: false,
    });
  }
});

router.put("/:id", async (req, res) => {
  const updateOrder = await Order.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  if (!updateOrder) {
    console.log(err);
    return res.status(400).json({
      error: err,
      success: false,
    });
  }
  return res.json(updateOrder);
});

router.delete("/:id", async (req, res) => {
  try {
    const deleterOrder = await Order.findByIdAndDelete(req.params.id);
    if (deleterOrder) {
      await deleterOrder.orderItems.map(async (orderItem) => {
        await OrderItem.findByIdAndRemove(orderItem);
      });
      return res
        .status(200)
        .json({ success: true, message: "The order has been deleted" });
    } else {
      return res.status(404).json({
        success: false,
        message: "The order not found! Please check your entry",
      });
    }
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      error: err,
      success: false,
    });
  }
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get("/get/count", async (_, res) => {
  const orderCount = await Order.countDocuments((count) => count);
  if (!orderCount) {
    return res.status(500).json({ success: false });
  }
  return res.send({
    orderCount,
  });
});

router.get("/get/userorders/:userid", async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });
  if (!userOrderList) {
    return res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = router;
