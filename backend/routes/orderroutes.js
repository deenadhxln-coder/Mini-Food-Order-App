const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Food = require("../models/Food");

// POST /api/orders - Create a new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    // Validate customer details
    if (!customer || !customer.name || !customer.mobile || !customer.address) {
      return res.status(400).json({
        message: "Customer name, mobile number, and delivery address are required.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(customer.mobile.trim())) {
      return res.status(400).json({
        message: "Please provide a valid 10-digit Indian mobile number.",
      });
    }

    // Validate order items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    // Format and sanitize items
    const formattedItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      let foodId = item.food || item.id || item._id;
      
      // If foodId is missing or not a valid 24-char ObjectId (e.g. old cached cart item), look up by name
      if (!foodId || !mongoose.Types.ObjectId.isValid(foodId)) {
        const matchedFood = await Food.findOne({ name: item.name });
        if (matchedFood) {
          foodId = matchedFood._id;
        } else {
          return res.status(400).json({
            message: `Invalid food item ID provided for: ${item.name || "Unknown item"}`,
          });
        }
      }

      const quantity = Number(item.quantity);
      const price = Number(item.price);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for item: ${item.name || "Unknown item"}`,
        });
      }

      if (price < 0 || isNaN(price)) {
        return res.status(400).json({
          message: `Invalid price for item: ${item.name || "Unknown item"}`,
        });
      }

      formattedItems.push({
        food: foodId,
        name: item.name,
        price,
        quantity,
      });

      calculatedTotal += price * quantity;
    }

    const finalTotal = typeof total === "number" && total > 0 ? total : calculatedTotal;

    const newOrder = new Order({
      customer: {
        name: customer.name.trim(),
        mobile: customer.mobile.trim(),
        address: customer.address.trim(),
      },
      items: formattedItems,
      total: finalTotal,
      status: "Placed",
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully!",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      message: "Failed to place order. Please try again.",
      error: error.message,
    });
  }
});

// GET /api/orders - Get all orders (recent first)
router.get("/", async (req, res) => {
  try {
    const { mobile } = req.query;
    const filter = {};

    if (mobile) {
      filter["customer.mobile"] = mobile.trim();
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
});

// GET /api/orders/:id - Get a single order by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID format." });
    }

    const order = await Order.findById(req.params.id).populate("items.food");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order details.",
      error: error.message,
    });
  }
});

// DELETE /api/orders/:id - Delete an order by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID format." });
    }

    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      message: "Order deleted successfully!",
      deletedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order.",
      error: error.message,
    });
  }
});

// PATCH /api/orders/:id/status - Update order status (e.g. Cancelled, Preparing, Delivered)
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID format." });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (status === "Cancelled" && order.status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel an order that has already been delivered." });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json({
      message: `Order status updated to ${status}!`,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status.",
      error: error.message,
    });
  }
});

module.exports = router;
