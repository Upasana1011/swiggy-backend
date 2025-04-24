const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/order")
const Cart = require("../model/cart")
const authenticate = require("../middlewares/authenticate")

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

// 🔹 Create Razorpay Order
router.post("/payment", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const options = {
      amount: cart.totalPrice,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating Razorpay order." });
  }
});

router.post("/payment/verify", authenticate, async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const userId = req.user?._id;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature." });
  }

  try {
    const cart = await Cart.findOne({ userId });
    const estimatedTime = (2 * 60 * 1000) || (15 * 60 * 1000);
    const deliveryTime = new Date(Date.now() + estimatedTime);

    const newOrder = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      deliveryTime,
      status: "placed",
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId });

    console.log({estimatedTime, deliveryTime})

    // setTimeout(async () => {
    //   await Order.findByIdAndUpdate(newOrder._id, { status: "delivered" });
    // }, estimatedTime);

    setTimeout(async () => {
      console.log("Executing setTimeout for order:", newOrder._id);
      try {
        await Order.findByIdAndUpdate(newOrder._id, { status: "delivered" });
        console.log("Order marked as delivered:", newOrder._id);
      } catch (error) {
        console.error("Error marking order as delivered:", error);
      }
    }, estimatedTime);

    return res.status(201).json({
      message: "Payment verified, order placed!",
      data: { ...newOrder.toObject(), deliveryTime }, // Include deliveryTime in response
    });
  } catch (err) {
    console.error("Error saving order:", err);
    return res.status(500).json({ message: "Error saving order." });
  }
});

router.get("", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid request." });
    }

    const orders = await Order.find({ userId })
      .populate("items.dishId")
      .populate("items.restaurantId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { orders: orders.map(order => ({ ...order.toObject(), deliveryTime: order.deliveryTime })) }, // Include deliveryTime
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;