
import { useEffect, useState } from "react";
import foods from "./data/foods";
import FoodList from "./components/FoodList";
import SearchFilter from "./components/SearchFilter";
import Cart from "./components/Cart";
import Checkout from "./components/CheckOut";
import OrderConfirmation from "./components/OrderConfirmation";
import Toast from "./components/Toast";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("foodie-cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(parsedCart)) return [];

      return parsedCart
        .filter(
          (item) =>
            item &&
            Number.isInteger(item.id) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            foods.some((food) => food.id === item.id)
        )
        .map((item) => ({
          ...foods.find((food) => food.id === item.id),
          quantity: item.quantity,
        }));
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

  function handlePlaceOrder(orderDetails) {
    setOrder({
      ...orderDetails,
      orderId: `FD${Date.now().toString().slice(-8)}`,
    });

    setCart([]);
    setView("confirmation");
    setToast("Your order has been placed!");
  }

  function handleContinueShopping() {
    setOrder(null);
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

          <FoodList
            foods={filteredFoods}
            onAddToCart={handleAddToCart}
          />
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
          onBack={() => setView("cart")}
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
