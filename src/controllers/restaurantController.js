const express = require("express");
const router = express.Router();
const Offer = require("../model/offer");
const TopRestaurant = require("../model/topRestaurants")
const AllRestaurants = require("../model/allRestaurants")

router.post("/allrestaurant", async (req, res) => {
  try {
        const restaurants = req.body;
        const insertedRestaurants = await AllRestaurants.insertMany(restaurants);
        res.status(201).json({ message: 'Offers added successfully!', data: insertedRestaurants });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error adding restaurants', error });
    }
});

router.get("", async (req, res) => {
  try {
    const offers = await Offer.find();
    const topRestaurants = await TopRestaurant.find();
    const allRestaurants = await AllRestaurants.find();
    return res.status(200).json({ success: true, data: {offers, topRestaurants, allRestaurants} });
  } catch (error) {
    return res.status(500).json({ error: error.message || "An error occurred" });
  }
});

router.get("/food/:foodname", async (req, res) => {
  try {
    const { foodname } = req.params;
    const searchRegex = new RegExp(foodname, "i");

    const filteredRestaurants = await AllRestaurants.find({
      "info.cuisines": { $regex: searchRegex },
    });

    return res.status(200).json({ success: true, data: { allRestaurants: filteredRestaurants } });
  } catch (error) {
    return res.status(500).json({ error: error.message || "An error occurred" });
  }
});

router.get("/cuisine/:cuisinename", async (req, res) => {
  try {
    const { cuisinename } = req.params;
    const { search } = req.query;

    const cuisineRegex = new RegExp(cuisinename, "i");
    const searchRegex = search ? new RegExp(search, "i") : null;

    const query = {
      "info.cuisines": { $regex: cuisineRegex },
    };

    if (searchRegex) {
      query["info.name"] = { $regex: searchRegex };
    }

    const filteredRestaurants = await AllRestaurants.find(query);

    return res.status(200).json({ success: true, data: { allRestaurants: filteredRestaurants } });
  } catch (error) {
    return res.status(500).json({ error: error.message || "An error occurred" });
  }
});

module.exports = router;