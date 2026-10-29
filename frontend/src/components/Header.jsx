import { BurgerIcon, UtensilsIcon, PackageIcon, CartIcon } from "./Icons";

function Header({ view, totalItems, onToggleCart, onToggleOrders, onBuyFoods, onGoHome }) {
  return (
    <header className="app-header">
      <div
        className="brand-container"
        onClick={onGoHome}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onGoHome?.();
          }
        }}
      >
        <span className="brand-logo">
          <BurgerIcon size={28} />
        </span>
        <div>
          <h1 className="brand-name">Foodie</h1>
          <p className="brand-tagline">Fresh & Fast Delights</p>
        </div>
      </div>

      <nav className="header-actions" aria-label="Main Navigation">
        <button
          type="button"
          className={`nav-button ${view === "menu" ? "nav-button-active" : ""}`}
          onClick={onBuyFoods || onGoHome}
        >
          <UtensilsIcon size={16} /> <span>Buy Foods</span>
        </button>

        <button
          type="button"
          className={`nav-button ${view === "orders" ? "nav-button-active" : ""}`}
          onClick={onToggleOrders}
        >
          <PackageIcon size={16} /> <span>My Orders</span>
        </button>

        <button
          type="button"
          className={`cart-toggle ${view === "cart" ? "nav-button-active" : ""}`}
          onClick={onToggleCart}
          aria-label={`View shopping cart with ${totalItems} items`}
        >
          <CartIcon size={16} /> <span>Cart</span> <span className="cart-badge">{totalItems}</span>
        </button>
      </nav>
    </header>
  );
}

export default Header;

