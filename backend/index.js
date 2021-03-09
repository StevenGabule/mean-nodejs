require("dotenv/config");
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/errorHandler");

const api = process.env.API_URL;
const port = process.env.PORT;

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use(morgan("tiny"));

app.use(authJWT());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);

mongoose
  .connect(process.env.DB_CON, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database is connected"))
  .catch((err) => console.error(err));

app.listen(port, () => console.log(`App is running on port: ${port}`));
