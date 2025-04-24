const express = require("express");
const router = express.Router();
const Cart = require("../model/cart");
const Dish = require("../model/dish");
const SavedAddress = require("../model/savedAddress");
const Order = require("../model/order"); // Import the Order model
const authenticate = require("../middlewares/authenticate");

const calculateTotalPrice = async (cart) => {
  let totalPrice = 0;
  for (let item of cart.items) {
    const dish = await Dish.findById(item.dishId);

    if (dish) {
      totalPrice += dish.info.finalPrice * item.quantity;
    }
  }
  return totalPrice;
};

router.post("/add", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ message: "Invalid request." });

    const { dishId, quantity, selectedAddons, selectedVariants, restaurantId } = req.body;

    if (!dishId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid request body." });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ dishId, quantity, selectedAddons, selectedVariants, restaurantId }] });
    } else {
      const existingItem = cart.items.find(item => item.dishId.toString() === dishId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ dishId, quantity, selectedAddons, selectedVariants, restaurantId });
      }
    }

    cart.totalPrice = await calculateTotalPrice(cart);

    await cart.save();
    return res.status(201).json({ success: true, message: "Item added to cart!", data: cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
});

router.patch("/update/:dishId", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { dishId } = req.params;
    const { quantity } = req.body;

    if (!userId || quantity === undefined || quantity < 0) {
      return res.status(400).json({ message: "Invalid request body." });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(500).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.dishId.toString() === dishId);
    console.log({ items: cart.items, dishId, itemIndex });
    if (itemIndex === -1) return res.status(500).json({ message: "Item not found in cart" });

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

     if (cart.items.length === 0) {
      await Cart.deleteOne({ userId });
      return res.status(200).json({ message: "Cart is empty and has been deleted.", data: { cart: [] } });
    }

    cart.totalPrice = await calculateTotalPrice(cart);
    await cart.save();

    return res.status(200).json({ message: "Cart updated successfully!", data: cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.get("", authenticate, async (req, res) => {
  try {
    const  userId = req.user?._id
    if (!userId) return res.status(400).json({ message: "Invalid request." });
    
    const cart = await Cart.findOne({ userId }).populate("items.dishId").populate("selectedAddress").populate("items.restaurantId");;
    if (!cart) return res.status(200).json({ success: true, data: {} });

    return res.status(200).json({ success: true, data: {cart} });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/clear", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ message: "Invalid request." });

    await Cart.findOneAndDelete({ userId });

    return res.status(200).json({ success: true, message: "Cart cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.delete("/item/:dishId", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { dishId } = req.params;

    if (!userId || !dishId) {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const itemIndex = cart.items.findIndex(item => item.dishId.toString() === dishId);
    if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart." });

    cart.items.splice(itemIndex, 1);
    cart.totalPrice = await calculateTotalPrice(cart);

    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed from cart.", data: cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
});

router.patch("/address", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { addressId, estimatedTime, distance } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ message: "Address ID is required." });
    }

    const savedAddress = await SavedAddress.findOne({ _id: addressId, userId });
    if (!savedAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    cart.selectedAddress = addressId;
    cart.estimatedTime = estimatedTime || 45;
    cart.distance = distance || 8;
    await cart.save();

    return res.status(200).json({ success: true, message: "Cart address updated.", data: cart });
  } catch (error) {
    console.error("Error updating address in cart:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

router.post("/reorder/:orderId", authenticate, async (req, res) => {
  try {
    const userId = req.user?._id;
    const { orderId } = req.params;

    if (!userId || !orderId) {
      return res.status(400).json({ message: "Invalid request parameters." });
    }

    const order = await Order.findOne({ _id: orderId, userId }).populate("items.dishId");
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    for (const orderItem of order.items) {
      const existingItem = cart.items.find(item => item.dishId.toString() === orderItem.dishId._id.toString());
      if (existingItem) {
        existingItem.quantity += orderItem.quantity;
      } else {
        cart.items.push({
          dishId: orderItem.dishId._id,
          quantity: orderItem.quantity,
          selectedAddons: orderItem.selectedAddons,
          selectedVariants: orderItem.selectedVariants,
          restaurantId: orderItem.restaurantId,
        });
      }
    }

    cart.totalPrice = await calculateTotalPrice(cart);
    await cart.save();

    return res.status(200).json({ success: true, message: "Items added to cart from order.", data: cart });
  } catch (error) {
    console.error("Error reordering items:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
