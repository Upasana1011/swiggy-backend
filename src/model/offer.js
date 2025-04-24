const mongoose = require("mongoose");

const ActionSchema = new mongoose.Schema({
  link: { type: String, required: true },
  text: { type: String, required: true },
  type: { type: String, required: true },
});

const AccessibilitySchema = new mongoose.Schema({
  altText: { type: String, required: true },
  altTextCta: { type: String, required: true },
});

const OfferSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imageId: { type: String, required: true },
  action: { type: ActionSchema, required: true },
  entityType: { type: String, required: true, enum: ["BANNER"] },
  accessibility: { type: AccessibilitySchema, required: true },
  entityId: { type: String, required: true },
  frequencyCapping: { type: mongoose.Schema.Types.Mixed, default: {} },
  externalMarketing: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const Offer = mongoose.model("Offer", OfferSchema);
module.exports = Offer;