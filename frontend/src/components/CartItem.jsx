
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="cart-item">
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
        >
          −
        </button>

        <span>{item.quantity}</span>

        <button
          type="button"
          onClick={() => onIncrease(item.id)}
          aria-label={`Increase ${item.name} quantity`}
        >
          +
        </button>
      </div>

      <button
        type="button"
        className="remove-button"
        onClick={() => onRemove(item.id)}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;
