const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  try {
    const users = await Users.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = await Users.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      apartment: req.body.apartment,
      zip: req.body.zip,
      street: req.body.street,
      city: req.body.city,
      country: req.body.country,
    });
    res.status(210).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false,
    });
  }
});

/**
 * LOGIN USER
 **/
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(400).send({
        message: "The email or password not found!",
      });
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const bcrypt = require("bcryptjs");
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        process.env.SECRET_HASHED,
        {
          expiresIn: "1w",
        }
      );
      return res.status(200).send({ user: user.email, token });
    } else {
      return res.status(400).send({
        message: "The email or password not found!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error,
      success: false,
    });
  }
});

/**
 * COUNT USER
 **/
router.get("/get/count", async (req, res) => {
  const userCount = await Users.countDocuments((count) => count);
  if (!userCount) {
    return res.status(500).json({ success: false });
  }
  return res.send({
    userCount,
  });
});

router.delete("/:id", async (req, res) => {
  try {
    await Products.findByIdAndRemove(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "The user has been slayed" });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "The user is no longer exists in the record.",
      success: false,
    });
  }
});

module.exports = router;
