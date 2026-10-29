import { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MenuView from "./components/MenuView";
import Cart from "./components/Cart";
import Checkout from "./components/CheckOut";
import OrderConfirmation from "./components/OrderConfirmation";
import OrdersView from "./components/OrdersView";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CART_SESSION_KEY = "foodie-cart-session";

function getCartSessionId() {
  try {
    let sessionId = localStorage.getItem(CART_SESSION_KEY);
    if (!sessionId) {
      sessionId =
        "cart_" +
        Math.random().toString(36).substring(2, 9) +
        Date.now().toString(36);
      localStorage.setItem(CART_SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "default_user";
  }
}

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");
  const [foods, setFoods] = useState([]);
  const [foodsLoading, setFoodsLoading] = useState(true);
  const [foodsError, setFoodsError] = useState("");
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [updatingCartId, setUpdatingCartId] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);

  useEffect(() => {
    async function fetchFoods() {
      try {
        setFoodsLoading(true);
        setFoodsError("");

        const response = await fetch(`${API_BASE_URL}/api/foods`);
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || "Failed to fetch food menu.");
        }

        const foodList = Array.isArray(data) ? data : [];
        const formattedFoods = foodList.map((food) => ({
          ...food,
          id: food.id || food._id,
        }));

        setFoods(formattedFoods);
      } catch (error) {
        console.error("Error fetching foods:", error);
        setFoodsError(
          error.message || "Unable to load the menu. Please ensure the backend is running and try again."
        );
      } finally {
        setFoodsLoading(false);
      }
    }

    fetchFoods();
  }, []);

  async function cartApiRequest(endpoint = "", options = {}) {
    const sessionId = getCartSessionId();
    const headers = {
      "Content-Type": "application/json",
      "x-session-id": sessionId,
      ...(options.headers || {}),
    };

    const response = await fetch(`${API_BASE_URL}/api/cart${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Cart operation failed.");
    }

    return data;
  }

  async function fetchCart() {
    try {
      setCartLoading(true);
      setCartError("");

      const data = await cartApiRequest();
      const items = Array.isArray(data?.items) ? data.items : [];
      setCart(items);
      return items;
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartError(
        error.message || "Unable to load cart. Please check your backend connection."
      );
      return [];
    } finally {
      setCartLoading(false);
    }
  }

  const [view, setView] = useState("menu");
  const [order, setOrder] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleToggleCart() {
    if (view !== "cart") {
      fetchCart();
      setView("cart");
    } else {
      setView("menu");
    }
  }

  async function handleAddToCart(food) {
    const foodId = food.id || food._id;

    try {
      setUpdatingCartId(foodId);
      const data = await cartApiRequest("/add", {
        method: "POST",
        body: JSON.stringify({ foodId, food }),
      });

      if (Array.isArray(data?.items)) {
        setCart(data.items);
      }
      setToast(data?.message || `${food.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      setToast(error.message || "Failed to add item to cart.");
    } finally {
      setUpdatingCartId(null);
    }
  }

  async function handleIncrease(id) {
    try {
      setUpdatingCartId(id);
      // Instant optimistic update so UI does not feel stuck
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );

      const data = await cartApiRequest(`/increase/${id}`, {
        method: "PATCH",
      });

      if (Array.isArray(data?.items)) {
        setCart(data.items);
      }
    } catch (error) {
      console.error("Failed to increase quantity:", error);
      setToast(error.message || "Failed to update item quantity.");
      fetchCart();
    } finally {
      setUpdatingCartId(null);
    }
  }

  async function handleDecrease(id) {
    try {
      setUpdatingCartId(id);
      // Instant optimistic update so UI does not feel stuck
      setCart((prevCart) =>
        prevCart
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );

      const data = await cartApiRequest(`/decrease/${id}`, {
        method: "PATCH",
      });

      if (Array.isArray(data?.items)) {
        setCart(data.items);
      }
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
      setToast(error.message || "Failed to update item quantity.");
      fetchCart();
    } finally {
      setUpdatingCartId(null);
    }
  }

  async function handleRemove(id) {
    const item = cart.find((food) => food.id === id);
    try {
      setUpdatingCartId(id);
      const data = await cartApiRequest(`/item/${id}`, {
        method: "DELETE",
      });

      if (Array.isArray(data?.items)) {
        setCart(data.items);
      }
      if (item) {
        setToast(data?.message || `${item.name} removed from cart.`);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      setToast(error.message || "Failed to remove item.");
      fetchCart();
    } finally {
      setUpdatingCartId(null);
    }
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

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to place order.");
      }

      const placedOrder = data?.order || data;

      setOrder(placedOrder);
      setCart([]);
      await cartApiRequest("", { method: "DELETE" }).catch(() => null);
      setView("confirmation");
      setToast(data?.message || "Your order has been placed successfully!");
    } catch (error) {
      console.error("Order placement failed:", error);
      setCheckoutError(
        error.message || "Unable to place order. Please check your connection."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  async function fetchOrders() {
    try {
      setOrdersLoading(true);
      setOrdersError("");
      const response = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch orders.");
      }

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersError(error.message || "Unable to load orders. Please try again.");
    } finally {
      setOrdersLoading(false);
    }
  }

  async function handleCancelOrder(orderId) {
    try {
      setIsCancellingOrder(true);
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to cancel order.");
      }

      setToast(data?.message || "Order cancelled successfully!");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));

      if (order && order._id === orderId) {
        setOrder((prev) => ({ ...prev, status: "Cancelled" }));
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
      setToast(error.message || "Unable to cancel order.");
    } finally {
      setIsCancellingOrder(false);
    }
  }

  function handleContinueShopping() {
    setOrder(null);
    setCheckoutError("");
    setView("menu");
    setToast("");
  }

  function handleBuyFoods() {
    if (view !== "menu") {
      setView("menu");
    }
    setTimeout(() => {
      const section = document.getElementById("buy-foods-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  }

  function handleGoHome() {
    setView("menu");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const categories = [
    "All",
    ...Array.from(new Set(foods.map((food) => food.category).filter(Boolean))),
  ];

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
    <div className="app-layout">
      <Header
        view={view}
        totalItems={totalItems}
        onToggleCart={handleToggleCart}
        onToggleOrders={() => {
          if (view !== "orders") {
            fetchOrders();
            setView("orders");
          } else {
            setView("menu");
          }
        }}
        onBuyFoods={handleBuyFoods}
        onGoHome={handleGoHome}
      />

      {view === "menu" && (
        <Hero
          onBuyFoods={handleBuyFoods}
          onExploreOrders={() => {
            fetchOrders();
            setView("orders");
          }}
        />
      )}

      <main className="app-container">
        {view === "menu" && (
          <MenuView
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            categories={categories}
            foods={filteredFoods}
            loading={foodsLoading}
            error={foodsError}
            cart={cart}
            updatingItemId={updatingCartId}
            onAddToCart={handleAddToCart}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        )}

        {view === "cart" && (
          <Cart
            cart={cart}
            loading={cartLoading}
            error={cartError}
            updatingItemId={updatingCartId}
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
            onCancelOrder={handleCancelOrder}
            onViewOrders={() => {
              fetchOrders();
              setView("orders");
            }}
            isCancelling={isCancellingOrder}
          />
        )}

        {view === "orders" && (
          <OrdersView
            orders={orders}
            loading={ordersLoading}
            error={ordersError}
            onCancelOrder={handleCancelOrder}
            onBackToMenu={() => setView("menu")}
            onRefreshOrders={fetchOrders}
            isCancelling={isCancellingOrder}
          />
        )}

        <Toast message={toast} />
      </main>

      <Footer
        onNavigateMenu={handleBuyFoods}
        onNavigateOrders={() => {
          fetchOrders();
          setView("orders");
        }}
        onNavigateCart={() =>
          setView((current) => (current === "cart" ? "menu" : "cart"))
        }
        totalItems={totalItems}
      />
    </div>
  );
}

export default App;
