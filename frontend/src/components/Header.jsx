function Header({ view, totalItems, onToggleCart }) {
  return (
    <header className="app-header">
      <div>
        <h1>Foodie 🍔</h1>
        <p>Discover your next favourite meal.</p>
      </div>

      {view !== "confirmation" && (
        <button
          type="button"
          className="cart-toggle"
          onClick={onToggleCart}
        >
          🛒 Cart ({totalItems})
        </button>
      )}
    </header>
  );
}

export default Header;
