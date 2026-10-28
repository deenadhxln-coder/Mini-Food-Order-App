function Header({ view, totalItems, onToggleCart, onToggleOrders }) {
  return (
    <header className="app-header">
      <div>
        <h1>Foodie 🍔</h1>
        <p>Discover your next favourite meal.</p>
      </div>

      <div className="header-actions">
        {view !== "confirmation" && (
          <>
            <button
              type="button"
              className={`nav-button ${view === "orders" ? "nav-button-active" : ""}`}
              onClick={onToggleOrders}
            >
              {view === "orders" ? "🍽️ Menu" : "📦 My Orders"}
            </button>

            <button
              type="button"
              className={`cart-toggle ${view === "cart" ? "nav-button-active" : ""}`}
              onClick={onToggleCart}
            >
              🛒 Cart ({totalItems})
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
