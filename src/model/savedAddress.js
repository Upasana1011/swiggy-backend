const mongoose = require("mongoose");

const CoordinatesSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
});

const SavedAddressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  coordinates: { type: CoordinatesSchema, required: true },
  doorNo: { type: String },
  landmark: { type: String },
  addressType: { type: String, enum: ["HOME", "WORK", "OTHER"], default: "HOME" },
  addressName: { type: String, default: null },
}, { timestamps: true });

const SavedAddress = mongoose.model("SavedAddress", SavedAddressSchema);
module.exports = SavedAddress;
