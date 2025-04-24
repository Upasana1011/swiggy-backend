const mongoose = require("mongoose");

const ChoiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  id: { type: String, required: true }, 
  groupId: { type: String, required: true },
});

const CartItemSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish", required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedAddons: { type: [ChoiceSchema], default: [] },
  selectedVariants: { type: mongoose.Schema.Types.Mixed, default: {} },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "AllRestaurant", required: true },
});

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [CartItemSchema], default: [] },
  totalPrice: { type: Number, required: true, default: 0 },
  selectedAddress: { type: mongoose.Schema.Types.ObjectId, ref: "SavedAddress" },
  estimatedTime: { type: Number, default: 45 },
  distance: { type: Number, default: 8 },
}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
