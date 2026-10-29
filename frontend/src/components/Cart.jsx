
import CartItem from "./CartItem";

function Cart({
  cart,
  loading = false,
  error = "",
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
        <p className="loading-state">Loading your cart...</p>
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
