require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://swiggy-clone-silky.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "bla bla bla",
  })
);

// Import controllers
const { signup, signin } = require("../src/controllers/authController");
app.use("/signup", signup);
app.use("/signin", signin);

const userController = require("../src/controllers/userController");
app.use("/users", userController);

const restaurantsController = require("../src/controllers/restaurantController");
app.use("/restaurants", restaurantsController);

const dishcontroller = require("../src/controllers/dishController");
app.use("/dish", dishcontroller);

const cuisineController = require("../src/controllers/cuisineController");
app.use("/cuisine", cuisineController);

const cartController = require("../src/controllers/cartController");
app.use("/cart", cartController);

const helpController = require("../src/controllers/helpController");
app.use("/help", helpController);

const savedAddressRoutes = require("../src/controllers/savedAddress");
app.use("/savedaddress", savedAddressRoutes);

const orderController = require("../src/controllers/orderController");
app.use("/order", orderController);

module.exports = app;
