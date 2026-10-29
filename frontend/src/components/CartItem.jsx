
function CartItem({ item, isUpdating = false, onIncrease, onDecrease, onRemove }) {
  return (
    <div className={`cart-item ${isUpdating ? "cart-item-updating" : ""}`}>
      <img src={item.image} alt={item.name} />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>₹{item.price} each</p>
        <strong>Subtotal: ₹{item.price * item.quantity}</strong>
      </div>

      <div className="quantity-controls">
        <button
          type="button"
          onClick={() => onDecrease(item.id)}
          aria-label={`Decrease ${item.name} quantity`}
          disabled={isUpdating}
        >
          −
        </button>

        <span className="quantity-value">
          {item.quantity}
          {isUpdating && <span className="app-spinner app-spinner-sm" aria-label="Updating" />}
        </span>

        <button
          type="button"
          onClick={() => onIncrease(item.id)}
          aria-label={`Increase ${item.name} quantity`}
          disabled={isUpdating}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="remove-button"
        onClick={() => onRemove(item.id)}
        disabled={isUpdating}
      >
        {isUpdating ? "Updating..." : "Remove"}
      </button>
    </div>
  );
}

export default CartItem;
