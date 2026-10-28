
function OrderConfirmation({ order, onContinueShopping, onCancelOrder, onViewOrders, isCancelling = false }) {
  function handleCancel() {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      onCancelOrder(order._id);
    }
  }

  const canCancel = order.status === "Placed" || order.status === "Preparing";

  return (
    <section className="confirmation-page">
      <div className="confirmation-icon">✓</div>

      <h2>Order Placed Successfully!</h2>
      <p><strong>Order ID:</strong> {order._id || order.orderId}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: order.status === "Cancelled" ? "#d32f2f" : "#18864b", fontWeight: "bold" }}>
          {order.status || "Placed"}
        </span>
      </p>

      <p>
        Thank you, {order.customer?.name}! Your order has been
        confirmed.
      </p>

      <div className="confirmation-summary">
        <h3>Order Summary</h3>

        {order.items?.map((item, index) => (
          <div className="summary-item" key={item._id || item.id || item.food || index}>
            <span>
              {item.name} × {item.quantity}
            </span>
            <strong>₹{item.price * item.quantity}</strong>
          </div>
        ))}

        <hr />

        <p>
          <strong>Total Paid:</strong> ₹{order.total}
        </p>

        <p>
          <strong>Deliver to:</strong> {order.customer?.address}
        </p>

        <p>
          <strong>Mobile:</strong> {order.customer?.mobile}
        </p>
      </div>

      <div className="confirmation-actions">
        <button
          type="button"
          className="place-order-button"
          onClick={onContinueShopping}
        >
          Continue Shopping
        </button>

        {onViewOrders && (
          <button
            type="button"
            className="secondary-button"
            onClick={onViewOrders}
          >
            View All Orders
          </button>
        )}

        {canCancel && onCancelOrder && (
          <button
            type="button"
            className="cancel-order-button"
            onClick={handleCancel}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>
    </section>
  );
}

export default OrderConfirmation;
