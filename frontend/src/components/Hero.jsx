function Hero({ onBuyFoods, onExploreOrders }) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <span className="hero-badge">🔥 Fresh & Fast Delivery</span>
        <h1 className="hero-title">
          Delicious Food Delivered Straight To Your Door
        </h1>
        <p className="hero-subtitle">
          Handcrafted pizzas, juicy burgers, mouthwatering desserts, and chilled drinks made fresh daily with premium ingredients.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="hero-primary-btn"
            onClick={onBuyFoods}
          >
            🍽️ Buy Foods
          </button>
          {onExploreOrders && (
            <button
              type="button"
              className="hero-secondary-btn"
              onClick={onExploreOrders}
            >
              📦 My Orders
            </button>
          )}
        </div>

        <div className="hero-features">
          <div className="hero-feature-item">
            <span className="feature-icon">⚡</span>
            <div>
              <strong>30 Min Delivery</strong>
              <p>Hot & fresh at your doorstep</p>
            </div>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">🌱</span>
            <div>
              <strong>100% Fresh</strong>
              <p>Quality ingredients guaranteed</p>
            </div>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">⭐</span>
            <div>
              <strong>4.8+ Rating</strong>
              <p>Loved by food lovers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-image-wrapper">
          <img
            src="/images/Margherita-Pizza.jpg"
            alt="Delicious Margherita Pizza"
            className="hero-image"
          />
          <div className="hero-floating-card">
            <span className="floating-badge">Chef's Special</span>
            <h4>Margherita Pizza</h4>
            <p>⭐ 4.8 · From ₹249</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
