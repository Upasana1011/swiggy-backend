const express = require("express");
const router = express.Router();
const HelpType = require("../model/helpType")
const HelpData = require("../model/helpData");
const Order = require("../model/order")
const authenticate = require("../middlewares/authenticate");

router.get("", async (req, res) => {
  try {
    const {isAuthenticated} = req.query;
    const filter = isAuthenticated === "true" ? {} : { showIfAuthenticated: { $ne: true } };
    const helpTypes = await HelpType.find(filter);
    return res.status(200).json({ success: true, data: {helpTypes} });
  } catch (error) {
    console.error("Error fetching help data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:type", async (req, res) => {
  try {
    const { type } = req.params;
    
    if (type === "past_orders") {
      const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

      const pastOrders = await Order.find({ userId }).populate("items.dishId");
      
      if (!pastOrders.length) {
        return res.status(200).json({ success: true, data: { pastOrders } });
      }

      return res.status(200).json({ success: true, data: { pastOrders } });
    }

    const helpArticles = await HelpData.find({ type });

    if (helpArticles.length === 0) {
      return res.status(500).json({ message: "No help articles found for this type." });
    }

    return res.status(200).json({ success: true, data: {helpArticles} });
  } catch (error) {
    console.error("Error fetching help data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/types", async (req, res) => {
  try {
    const helpTypes = req.body; 

    if (!Array.isArray(helpTypes) || helpTypes.length === 0) {
      return res.status(400).json({ message: "Invalid input, expected an array of help types." });
    }

    const insertedHelpTypes = await HelpType.insertMany(helpTypes);
    return res.status(201).json(insertedHelpTypes);
  } catch (error) {
    console.error("Error inserting help types:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/data", async (req, res) => {
  try {
    const helpData = req.body;

    if (!Array.isArray(helpData) || helpData.length === 0) {
      return res.status(400).json({ message: "Invalid input, expected an array of help data." });
    }

    const types = await HelpType.find().select("type");
    const validTypes = types.map(t => t.type);

    for (let entry of helpData) {
      if (!validTypes.includes(entry.type)) {
        return res.status(400).json({ message: `Invalid type: ${entry.type}. It must be one of ${validTypes.join(", ")}` });
      }
    }

    const insertedHelpData = await HelpData.insertMany(helpData);
    return res.status(201).json(insertedHelpData);
  } catch (error) {
    console.error("Error inserting help data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

