const express = require("express");
const router = express.Router();
const SavedAddress = require("../model/savedAddress")
const authenticate = require("../middlewares/authenticate")


router.post("/add", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { phone, address, coordinates, doorNo, landmark, addressType, addressName } = req.body;

    if (!phone || !address || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existing = await SavedAddress.findOne({
      userId,
      address: address.trim(),
      "coordinates.lat": coordinates.lat,
      "coordinates.lng": coordinates.lng
    });

    if (existing) {
      return res.status(409).json({ success: false, message: "Address already saved." });
    }

    const newSavedAddress = new SavedAddress({
      userId,
      phone,
      address: address.trim(),
      coordinates,
      doorNo,
      landmark,
      addressType,
      addressName
    });

    await newSavedAddress.save();
    return res.status(201).json({ success: true, message: "Address saved!", data: newSavedAddress });
  } catch (error) {
    console.error("Error saving address:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
});


router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const addresses = await SavedAddress.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: {addresses} });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
});

module.exports = router;
