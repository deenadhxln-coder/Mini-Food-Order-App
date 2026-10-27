
require("dotenv").config();

const mongoose = require("mongoose");
const Food = require("./models/Food");


const foods = [
  {
    name: "Margherita Pizza",
    price: 249,
    category: "Pizza",
    rating: 4.5,
    image: "/images/Margherita-Pizza.jpg",
    description: "Classic cheese pizza with fresh tomato sauce.",
  },
  {
    name: "Pepperoni Pizza",
    price: 349,
    category: "Pizza",
    rating: 4.8,
    image: "/images/Pepperoni-Pizza.jpg",
    description: "Loaded with pepperoni and melted cheese.",
  },
  {
    name: "Veggie Burger",
    price: 149,
    category: "Burger",
    rating: 4.3,
    image: "/images/Veggie-Burger.jpg",
    description: "A delicious vegetable patty with fresh lettuce.",
  },
  {
    name: "Cheese Burger",
    price: 199,
    category: "Burger",
    rating: 4.6,
    image: "/images/Cheese-Burger.jpg",
    description: "Juicy burger with cheese and fresh vegetables.",
  },
  {
    name: "French Fries",
    price: 99,
    category: "Burger",
    rating: 4.2,
    image: "/images/French-Fries.jpg",
    description: "Crispy golden fries seasoned with salt.",
  },
  {
    name: "Chocolate Cake",
    price: 129,
    category: "Desserts",
    rating: 4.7,
    image: "/images/Chocolate-Cake.jpg",
    description: "Rich chocolate cake for dessert lovers.",
  },
  {
    name: "Ice Cream",
    price: 89,
    category: "Desserts",
    rating: 4.4,
    image: "/images/Ice-Cream.jpg",
    description: "Creamy ice cream served chilled.",
  },
  {
    name: "Chocolate Milkshake",
    price: 119,
    category: "Drinks",
    rating: 4.5,
    image: "/images/Chocolate-Milkshake.jpg",
    description: "A refreshing chocolate milkshake.",
  },
  {
    name: "Fresh Lemonade",
    price: 69,
    category: "Drinks",
    rating: 4.1,
    image: "/images/Fresh-Lemonade.jpg",
    description: "Fresh lemonade with a hint of mint.",
  },
  {
    name: "Pancakes",
    price: 159,
    category: "Desserts",
    rating: 4.6,
    image: "/images/Pancakes.jpg",
    description: "Fluffy pancakes with a sweet topping.",
  },
];


async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected!");

    for (const food of foods) {
      await Food.updateOne(
        { name: food.name },
        {
          $set: {
            ...food,
            available: true,
          },
        },
        { upsert: true }
      );
    }

    console.log("Food menu seeded successfully!");
    console.log(`Total menu items processed: ${foods.length}`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedFoods();
