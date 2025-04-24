const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
  dishId: { type: mongoose.Schema.Types.ObjectId, ref: "Dish", required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedAddons: { type: [{ name: String, price: Number }], default: [] },
  selectedVariants: { type: mongoose.Schema.Types.Mixed, default: {} },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "AllRestaurant", required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["placed", "delivered", "canceled"], default: "placed" },
    deliveryTime: { type: Date, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;