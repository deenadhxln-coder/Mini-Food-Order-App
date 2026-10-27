
import { useEffect, useState } from "react";
import FoodList from "./components/FoodList";
import SearchFilter from "./components/SearchFilter";
import Cart from "./components/Cart";
import Checkout from "./components/CheckOut";
import OrderConfirmation from "./components/OrderConfirmation";
import Toast from "./components/Toast";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [foodsError, setFoodsError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    async function fetchFoods() {
      try {
        setFoodsLoading(true);
        setFoodsError("");

        const response = await fetch(`${API_BASE_URL}/api/foods`);

        if (!response.ok) {
          throw new Error("Failed to fetch food menu.");
        }

        const data = await response.json();

        const formattedFoods = data.map((food) => ({
          ...food,
          id: food._id,
        }));

        setFoods(formattedFoods);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setFoodsError(
          "Unable to load the menu. Please ensure the backend is running and try again."
        );
      } finally {
        setFoodsLoading(false);
      }
    }

    fetchFoods();
  }, []);


const [cart, setCart] = useState(() => {
  try {
    const savedCart = localStorage.getItem("foodie-cart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart.filter(
      (item) =>
        item &&
        item.name &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
});


  const [view, setView] = useState("menu");
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("foodie-cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Could not save cart:", error);
    }
  }, [cart]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  function handleAddToCart(food) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === food.id
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...food, quantity: 1 }];
    });

    setToast(`${food.name} added to cart!`);
  }

  function handleIncrease(id) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function handleDecrease(id) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function handleRemove(id) {
    const item = cart.find((food) => food.id === id);

    setCart((currentCart) =>
      currentCart.filter((food) => food.id !== id)
    );

    if (item) setToast(`${item.name} removed from cart.`);
  }

  async function handlePlaceOrder(orderDetails) {
    try {
      setIsPlacingOrder(true);
      setCheckoutError("");

      const payload = {
        customer: orderDetails.customer,
        items: orderDetails.items.map((item) => ({
          food: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: orderDetails.total,
      };

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      const placedOrder = data.order || data;

      setOrder(placedOrder);
      setCart([]);
      setView("confirmation");
      setToast("Your order has been placed successfully!");
    } catch (error) {
      console.error("Order placement failed:", error);
      setCheckoutError(
        error.message || "Unable to place order. Please check your connection."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  function handleContinueShopping() {
    setOrder(null);
    setCheckoutError("");
    setView("menu");
    setToast("");
  }

  const filteredFoods = foods
    .filter((food) =>
      food.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (food) => category === "All" || food.category === category
    )
    .sort((a, b) => {
      if (sortOrder === "low-high") return a.price - b.price;
      if (sortOrder === "high-low") return b.price - a.price;
      return 0;
    });

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="app-container">
      <header className="app-header">
        <div>
          <h1>Foodie 🍔</h1>
          <p>Discover your next favourite meal.</p>
        </div>

        {view !== "confirmation" && (
          <button
            type="button"
            className="cart-toggle"
            onClick={() =>
              setView((current) =>
                current === "cart" ? "menu" : "cart"
              )
            }
          >
            🛒 Cart ({totalItems})
          </button>
        )}
      </header>

      {view === "menu" && (
        <section>
          <h2>Our Menu</h2>

          <SearchFilter
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          <p className="results-count">
            Showing {filteredFoods.length} food items
          </p>

          
            {foodsLoading ? (
              <p>Loading delicious food...</p>
            ) : foodsError ? (
              <p role="alert">{foodsError}</p>
            ) : (
              <FoodList
                foods={filteredFoods}
                onAddToCart={handleAddToCart}
              />
            )}

        </section>
      )}

      {view === "cart" && (
        <Cart
          cart={cart}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onRemove={handleRemove}
          onCheckout={() => setView("checkout")}
        />
      )}

      {view === "checkout" && (
        <Checkout
          cart={cart}
          onPlaceOrder={handlePlaceOrder}
          onBack={() => {
            setCheckoutError("");
            setView("cart");
          }}
          isPlacingOrder={isPlacingOrder}
          submitError={checkoutError}
        />
      )}

      {view === "confirmation" && order && (
        <OrderConfirmation
          order={order}
          onContinueShopping={handleContinueShopping}
        />
      )}

      <Toast message={toast} />
    </main>
  );
}

export default App;
