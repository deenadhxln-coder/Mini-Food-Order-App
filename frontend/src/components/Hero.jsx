import { useState, useEffect } from "react";

const FEATURED_DISHES = [
  {
    id: "pizza",
    name: "Artisan Margherita Pizza",
    category: "Pizza",
    price: "₹249",
    image: "/images/Margherita-Pizza.jpg",
    alt: "Artisan Margherita Pizza with fresh basil and mozzarella",
    speed: "25 min delivery",
    tagTitle: "Chef's Special Pizza",
    tagIcon: "🍕",
  },
  {
    id: "burger",
    name: "Gourmet Cheese Burger",
    category: "Burger",
    price: "₹179",
    image: "/images/Cheese-Burger.jpg",
    alt: "Juicy gourmet cheese burger with crisp lettuce",
    speed: "20 min delivery",
    tagTitle: "Bestseller Gourmet Burger",
    tagIcon: "🍔",
  },
  {
    id: "shake",
    name: "Chocolate Milkshake",
    category: "Drink",
    price: "₹129",
    image: "/images/Chocolate-Milkshake.jpg",
    alt: "Creamy chocolate milkshake with chocolate drizzle",
    speed: "15 min delivery",
    tagTitle: "Chilled Sweet Delight",
    tagIcon: "🥤",
  },
  {
    id: "cake",
    name: "Truffle Chocolate Cake",
    category: "Dessert",
    price: "₹149",
    image: "/images/Chocolate-Cake.jpg",
    alt: "Rich Dutch chocolate truffle cake slice",
    speed: "20 min delivery",
    tagTitle: "Decadent Dessert",
    tagIcon: "🍰",
  },
];

const QUICK_CATEGORIES = [
  { label: "All Items", icon: "🍽️", category: "All" },
  { label: "Pizzas", icon: "🍕", category: "Pizza" },
  { label: "Burgers", icon: "🍔", category: "Burger" },
  { label: "Drinks", icon: "🥤", category: "Drink" },
  { label: "Desserts", icon: "🍰", category: "Dessert" },
];

function Hero({ onBuyFoods, onExploreOrders, onSelectCategory }) {
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeDish = FEATURED_DISHES[activeDishIndex];

  // Auto-rotate featured dishes every 4.5 seconds when not paused by user hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveDishIndex((prev) => (prev + 1) % FEATURED_DISHES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  function handleCategoryClick(categoryName) {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    } else if (onBuyFoods) {
      onBuyFoods();
    }
  }

  function handleOrderFeaturedDish() {
    if (onSelectCategory) {
      onSelectCategory(activeDish.category);
    } else if (onBuyFoods) {
      onBuyFoods();
    }
  }

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-main-grid">
          <div className="hero-content">
            <div className="hero-badge-wrap">
              <span className="hero-badge-pill">🔥 30-Min Express Delivery</span>
              <span className="hero-badge-sub">Fresh Ingredients Daily</span>
            </div>

            <h1 className="hero-title">
              Delicious Food, <br />
              <span className="hero-highlight">Delivered Fresh</span> <br />
              To Your Doorstep.
            </h1>

            <p className="hero-subtitle">
              Savour our hand-tossed artisan pizzas, sizzling gourmet burgers, thick chilled milkshakes, and mouthwatering desserts. Prepared fresh on every single order.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="hero-primary-btn"
                onClick={onBuyFoods}
              >
                🍽️ Buy Foods Now
              </button>
              {onExploreOrders && (
                <button
                  type="button"
                  className="hero-secondary-btn"
                  onClick={onExploreOrders}
                >
                  📦 Track Orders
                </button>
              )}
            </div>

            {/* Quick Category Jump Shortcuts */}
            <div className="hero-quick-categories">
              <span className="hero-quick-label">⚡ Explore by Category:</span>
              <div className="hero-category-pills">
                {QUICK_CATEGORIES.map((item) => (
                  <button
                    key={item.category}
                    type="button"
                    className="hero-category-pill-btn"
                    onClick={() => handleCategoryClick(item.category)}
                  >
                    <span className="pill-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="stat-number">30+</span>
                <span className="stat-label">Min Delivery</span>
              </div>
              <div className="stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">4.8★</span>
                <span className="stat-label">Customer Rating</span>
              </div>
              <div className="stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Hygienic & Fresh</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div
              className="hero-image-card"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <img
                key={activeDish.id}
                src={activeDish.image}
                alt={activeDish.alt}
                className="hero-main-img"
              />

              <div className="hero-floating-tag top-tag">
                <span className="tag-icon">⚡</span>
                <div>
                  <strong>{activeDish.badgeTop}</strong>
                  <p>{activeDish.speed}</p>
                </div>
              </div>

              <div className="hero-floating-tag bottom-tag">
                <span className="tag-icon">{activeDish.tagIcon}</span>
                <div>
                  <strong>{activeDish.tagTitle}</strong>
                  <p>Starting at {activeDish.price}</p>
                </div>
              </div>

              {/* Interactive Dish Selector Tabs */}
              <div className="hero-dish-selector-bar">
                <div className="hero-dish-tabs">
                  {FEATURED_DISHES.map((dish, index) => (
                    <button
                      key={dish.id}
                      type="button"
                      className={`hero-dish-tab ${index === activeDishIndex ? "active" : ""}`}
                      onClick={() => setActiveDishIndex(index)}
                      aria-label={`View ${dish.name}`}
                    >
                      <span className="dish-tab-icon">{dish.tagIcon}</span>
                      <span className="dish-tab-name">{dish.category}</span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="hero-dish-order-btn"
                  onClick={handleOrderFeaturedDish}
                  title={`Order ${activeDish.name}`}
                >
                  Order {activeDish.price} →
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="hero-scroll-indicator"
          onClick={onBuyFoods}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onBuyFoods();
            }
          }}
          aria-label="Scroll down to explore foods"
        >
          <span className="scroll-text">Scroll Down to Explore & Buy Foods</span>
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
