const express = require("express");
const router = express.Router();
const Dish = require("../model/dish")
const AllRestaurants = require("../model/allRestaurants")
const TopRestaurant = require("../model/topRestaurants")

router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find();

    return res.status(200).json({ success: true, data: { dishes} });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("", async (req, res) => {
  try {
        const dishes = req.body;
        const insertedDishes = await Dish.insertMany(dishes);
        return res.status(201).json({ message: 'Offers added successfully!', data: insertedDishes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding restaurants', error });
    }
});

router.get("/:restaurantId", async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { query } = req.query;

    let restaurant = await AllRestaurants.findOne({ "_id": restaurantId });
     
    if(!restaurant){
      restaurant = await TopRestaurant.findOne({ "_id": restaurantId });
    }

    if (!restaurant) {
      return res.status(400).json({ message: "Restaurant not found" });
    }

    const restaurantCuisines = restaurant.info.cuisines;

    if (!restaurantCuisines || restaurantCuisines.length === 0) {
      return res.status(400).json({ message: "Restaurant has no cuisines listed" });
    }

    let filter = { "info.cuisines": { $elemMatch: { $in: restaurantCuisines } } };

    if (query) {
      filter["info.name"] = { $regex: query, $options: "i" };
    }

    const dishes = await Dish.find(filter);

    return res.status(200).json({ success: true, data: {restaurantId, dishes, restaurant} });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log({id})
    const { cuisines } = req.body;

    if (!cuisines || !Array.isArray(cuisines)) {
      return res.status(400).json({ message: "Cuisines must be an array." });
    }

    const updatedDish = await Dish.findOneAndUpdate(
      { "_id": id },
      { $set: { "info.cuisines": cuisines } },
      { new: true }
    );

    if (!updatedDish) {
      return res.status(404).json({ message: "Dish not found." });
    }

    return res.status(200).json({ message: "Cuisines updated successfully.", data: updatedDish });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating cuisines", error });
  }
});


module.exports = router;