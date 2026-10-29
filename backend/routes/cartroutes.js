const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Food = require("../models/Food");

// Helper to extract session identifier
function getSessionId(req) {
  return (
    req.headers["x-session-id"] ||
    req.headers["x-cart-session"] ||
    req.query.sessionId ||
    req.body.sessionId ||
    "default_user"
  );
}

// Helper to format consistent cart response
function formatCartResponse(cart) {
  const items = (cart?.items || []).map((item) => ({
    id: item.food ? item.food.toString() : "",
    food: item.food,
    name: item.name,
    price: item.price,
    image: item.image,
    category: item.category,
    quantity: item.quantity,
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    sessionId: cart?.sessionId || "default_user",
    items,
    totalItems,
    totalPrice,
  };
}

// Helper to get or create cart for a session
async function getOrCreateCart(sessionId) {
  let cart = await Cart.findOne({ sessionId });
  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }
  return cart;
}

// GET /api/cart - Fetch current cart
router.get("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await getOrCreateCart(sessionId);

    res.status(200).json(formatCartResponse(cart));
  } catch (error) {
    console.error("Fetch cart error:", error);
    res.status(500).json({
      message: "Failed to fetch cart.",
      error: error.message,
    });
  }
});

// POST /api/cart/add - Add food item to cart
router.post("/add", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { foodId, quantity = 1, food: foodPayload } = req.body;

    const targetFoodId = foodId || foodPayload?.id || foodPayload?._id;

    if (!targetFoodId) {
      return res.status(400).json({ message: "foodId is required." });
    }

    let food = null;
    if (mongoose.Types.ObjectId.isValid(targetFoodId)) {
      food = await Food.findById(targetFoodId);
    }

    // Fallback search by name if ID was not valid ObjectId or not found
    if (!food && foodPayload?.name) {
      food = await Food.findOne({ name: foodPayload.name });
    }

    if (!food) {
      return res.status(404).json({ message: "Food item not found." });
    }

    const cart = await getOrCreateCart(sessionId);

    const existingItem = cart.items.find(
      (item) => item.food.toString() === food._id.toString()
    );

    const addQty = Math.max(1, Number(quantity) || 1);

    if (existingItem) {
      existingItem.quantity += addQty;
    } else {
      cart.items.push({
        food: food._id,
        name: food.name,
        price: food.price,
        image: food.image || "",
        category: food.category || "",
        quantity: addQty,
      });
    }

    await cart.save();

    res.status(200).json({
      message: `${food.name} added to cart!`,
      ...formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      message: "Failed to add item to cart.",
      error: error.message,
    });
  }
});

// PATCH & POST /api/cart/increase/:foodId - Increase quantity by 1
const handleIncrease = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(400).json({ message: "foodId parameter is required." });
    }

    const cart = await getOrCreateCart(sessionId);
    const item = cart.items.find(
      (entry) => entry.food.toString() === foodId.toString()
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    item.quantity += 1;
    await cart.save();

    res.status(200).json({
      message: `Increased quantity of ${item.name}`,
      ...formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Increase cart error:", error);
    res.status(500).json({
      message: "Failed to increase item quantity.",
      error: error.message,
    });
  }
};

router.patch("/increase/:foodId", handleIncrease);
router.post("/increase/:foodId", handleIncrease);

// PATCH & POST /api/cart/decrease/:foodId - Decrease quantity by 1
const handleDecrease = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { foodId } = req.params;

    if (!foodId) {
      return res.status(400).json({ message: "foodId parameter is required." });
    }

    const cart = await getOrCreateCart(sessionId);
    const itemIndex = cart.items.findIndex(
      (entry) => entry.food.toString() === foodId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    const itemName = cart.items[itemIndex].name;

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    res.status(200).json({
      message: `Updated ${itemName} in cart`,
      ...formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Decrease cart error:", error);
    res.status(500).json({
      message: "Failed to decrease item quantity.",
      error: error.message,
    });
  }
};

router.patch("/decrease/:foodId", handleDecrease);
router.post("/decrease/:foodId", handleDecrease);

// DELETE /api/cart/item/:foodId & /api/cart/:foodId - Remove single item from cart
const handleRemoveItem = async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { foodId } = req.params;

    const cart = await getOrCreateCart(sessionId);
    const initialCount = cart.items.length;

    cart.items = cart.items.filter(
      (entry) => entry.food.toString() !== foodId.toString()
    );

    if (cart.items.length === initialCount) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    await cart.save();

    res.status(200).json({
      message: "Item removed from cart.",
      ...formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Remove cart item error:", error);
    res.status(500).json({
      message: "Failed to remove item from cart.",
      error: error.message,
    });
  }
};

router.delete("/item/:foodId", handleRemoveItem);
router.delete("/:foodId", handleRemoveItem);

// DELETE /api/cart - Clear entire cart
router.delete("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const cart = await getOrCreateCart(sessionId);

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully.",
      ...formatCartResponse(cart),
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      message: "Failed to clear cart.",
      error: error.message,
    });
  }
});

module.exports = router;
