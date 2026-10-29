
import CartItem from "./CartItem";

function Cart({
  cart,
  loading = false,
  error = "",
  updatingItemId = null,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}) {
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-section">
      <h2>Your Shopping Cart</h2>

      {loading ? (
        <div className="loading-container">
          <div className="app-spinner app-spinner-lg" aria-hidden="true" />
          <p>Loading your cart...</p>
        </div>
      ) : error ? (
        <p className="error-message" role="alert">{error}</p>
      ) : cart.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. Add some delicious food!
        </p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                isUpdating={updatingItemId === item.id}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
              />
            ))}
          </div>

          <div className="cart-summary">
            <p>Total items: {totalItems}</p>
            <h3>Total: ₹{totalPrice}</h3>

            <button type="button" onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
