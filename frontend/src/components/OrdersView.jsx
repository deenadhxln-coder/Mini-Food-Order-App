import { ArrowLeftIcon, RefreshIcon } from "./Icons";

function OrdersView({
  orders = [],
  loading = false,
  error = "",
  onCancelOrder,
  onBackToMenu,
  onRefreshOrders,
  isCancelling = false,
}) {
  function getStatusClass(status) {
    switch (status) {
      case "Placed":
        return "status-badge status-placed";
      case "Preparing":
        return "status-badge status-preparing";
      case "Out for Delivery":
        return "status-badge status-delivery";
      case "Delivered":
        return "status-badge status-delivered";
      case "Cancelled":
        return "status-badge status-cancelled";
      default:
        return "status-badge";
    }
  }

  function handleCancelClick(orderId) {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      onCancelOrder(orderId);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <section className="orders-section">
      <div className="orders-header">
        <button type="button" className="back-button" onClick={onBackToMenu}>
          <ArrowLeftIcon size={16} /> Back to Menu
        </button>
        <h2>My Orders</h2>
        <button
          type="button"
          className="refresh-button"
          onClick={onRefreshOrders}
          disabled={loading}
          title="Refresh orders"
        >
          <RefreshIcon size={14} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="app-spinner app-spinner-lg" aria-hidden="true" />
          <p>Loading your orders...</p>
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="empty-orders">
          <p>You haven't placed any orders yet.</p>
          <button type="button" className="place-order-button" onClick={onBackToMenu}>
            Browse Menu
          </button>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => {
            const canCancel = order.status === "Placed" || order.status === "Preparing";

            return (
              <article key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <span className="order-id">Order #{order._id.slice(-6).toUpperCase()}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={getStatusClass(order.status)}>
                    {order.status || "Placed"}
                  </span>
                </div>

                <div className="order-items-list">
                  {order.items?.map((item, index) => (
                    <div key={item._id || item.id || item.food || index} className="order-item-row">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-delivery-info">
                    <p><strong>Deliver to:</strong> {order.customer?.name}, {order.customer?.address}</p>
                    <p><strong>Mobile:</strong> {order.customer?.mobile}</p>
                  </div>

                  <div className="order-total-action">
                    <strong className="order-total-amount">Total: ₹{order.total}</strong>
                    {canCancel && (
                      <button
                        type="button"
                        className="cancel-order-button"
                        onClick={() => handleCancelClick(order._id)}
                        disabled={isCancelling}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OrdersView;
