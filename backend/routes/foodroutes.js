
const express = require("express");
const router = express.Router();

const Food = require("../models/Food");

// GET all food items
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch food items",
      error: error.message,
    });
  }
});

// GET a single food item by ID
router.get("/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food item not found",
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({
      message: "Invalid food ID",
    });
  }
});

module.exports = router;
