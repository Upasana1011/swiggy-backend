const express = require("express");
const router = express.Router();
const Dish = require("../model/dish");

router.get("/:cuisinename", async (req, res) => {
  try {
    const { cuisinename } = req.params;
    const { query } = req.query;

    let filter = {
      "info.cuisines": { $in: [cuisinename] }
    };

    if (query) {
      filter["info.name"] = { $regex: query, $options: "i" };
    }

    const dishes = await Dish.find(filter);

    return res.status(200).json({ success: true, data: { dishes, cuisinename } });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
