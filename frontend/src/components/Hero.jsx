function Hero({ onBuyFoods, onExploreOrders }) {
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
            <div className="hero-image-card">
              <img
                src="/images/Margherita-Pizza.jpg"
                alt="Freshly Baked Artisan Pizza"
                className="hero-main-img"
              />
              <div className="hero-floating-tag top-tag">
                <span className="tag-icon">⚡</span>
                <div>
                  <strong>Super Fast</strong>
                  <p>Average 25 min delivery</p>
                </div>
              </div>
              <div className="hero-floating-tag bottom-tag">
                <span className="tag-icon">🍕</span>
                <div>
                  <strong>Chef's Special Pizza</strong>
                  <p>Starting at ₹249</p>
                </div>
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
