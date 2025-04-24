const mongoose = require("mongoose");

const ChoiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: false },
  inStock: { type: Number, required: false },
  isVeg: { type: Number, default: null },
  isEnabled: { type: Number, required: true }
});

const AddonSchema = new mongoose.Schema({
  groupId: { type: String, required: true },
  groupName: { type: String, required: true },
  choices: { type: [ChoiceSchema], required: true },
  maxAddons: { type: Number, required: true },
  maxFreeAddons: { type: Number, required: true }
});
 
const ItemAttributeSchema = new mongoose.Schema({
  vegClassifier: { type: String, required: true }
});

const RatingSchema = new mongoose.Schema({
  rating: { type: String, required: false },
  ratingCount: { type: String, required: false },
  ratingCountV2: { type: String, required: false }
});

const AggregatedRatingSchema = new mongoose.Schema({
  aggregatedRating: { type: RatingSchema, required: true }
});

const OfferTagSchema = new mongoose.Schema({
  matchText: { type: String, required: true }
});

const InfoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cuisines: { type: [String], required: true },
  description: { type: String, required: false },
  imageId: { type: String, required: false },
  inStock: { type: Number, required: false },
  isVeg: { type: Number, required: false },
  price: { type: Number, required: false },
  finalPrice: { type: Number, required: false, default: function () { return this.price; }  },
  variants: { type: mongoose.Schema.Types.Mixed, default: {} },
  variantsV2: { type: mongoose.Schema.Types.Mixed, default: {} },
  addons: { type: [AddonSchema], default: [] },
  itemAttribute: { type: ItemAttributeSchema, required: false },
  ribbon: { type: mongoose.Schema.Types.Mixed, default: {} },
  type: { type: String, required: false },
  offerTags: { type: [OfferTagSchema], default: [] },
  itemBadge: { type: mongoose.Schema.Types.Mixed, default: {} },
  badgesV2: { type: mongoose.Schema.Types.Mixed, default: {} },
  itemNudgeType: { type: String, required: false },
  ratings: { type: AggregatedRatingSchema, required: true },
  itemPriceStrikeOff: { type: Boolean, required: false },
  offerIds: { type: [String], default: [] }
});

const DishSchema = new mongoose.Schema({
  "@type": { type: String, required: true },
  info: { type: InfoSchema, required: true },
  analytics: { type: mongoose.Schema.Types.Mixed, default: {} },
  hideRestaurantDetails: { type: Boolean, required: false }
}, { timestamps: true });

const Dish = mongoose.model("Dish", DishSchema);
module.exports = Dish;
