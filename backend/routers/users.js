const express = require("express");
const router = express.Router();
const Users = require("../models/user");

router.get(`/`, async (req, res) => {
  const users = await Users.find();
  if (!users) {
    res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
  res.send(users);
});

router.post(`/`, (req, res) => {
  const user = new Users({
    name: req.body.name,
    image: req.body.image,
    qty: req.body.qty,
  });
  user
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
