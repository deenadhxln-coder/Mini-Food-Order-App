
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      mobile: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
