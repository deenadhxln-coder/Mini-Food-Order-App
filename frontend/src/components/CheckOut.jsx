
import { useState } from "react";

function Checkout({ cart, onPlaceOrder, onBack, isPlacingOrder = false, submitError = "" }) {
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function handleChange(event) {
    const { name, value } = event.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!customer.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!/^[6-9]\d{9}$/.test(customer.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit Indian mobile number.";
    }

    if (!customer.address.trim()) {
      newErrors.address = "Please enter your delivery address.";
    }

    if (cart.length === 0) {
      newErrors.cart = "Your cart is empty.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    onPlaceOrder({
      customer,
      items: cart,
      total: totalPrice,
    });
  }

  return (
    <section className="checkout-page">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Back to Cart
      </button>

      <h2>Checkout</h2>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h3>Delivery Details</h3>

          <label htmlFor="customer-name">Full Name</label>
          <input
            id="customer-name"
            name="name"
            value={customer.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}

          <label htmlFor="customer-mobile">Mobile Number</label>
          <input
            id="customer-mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={customer.mobile}
            onChange={handleChange}
            placeholder="10-digit mobile number"
          />
          {errors.mobile && (
            <p className="form-error">{errors.mobile}</p>
          )}

          <label htmlFor="customer-address">Delivery Address</label>
          <textarea
            id="customer-address"
            name="address"
            rows={4}
            value={customer.address}
            onChange={handleChange}
            placeholder="Enter your complete delivery address"
          />
          {errors.address && (
            <p className="form-error">{errors.address}</p>
          )}

          {errors.cart && <p className="form-error">{errors.cart}</p>}
          {submitError && <p className="form-error" role="alert">{submitError}</p>}

          <button
            type="submit"
            className="place-order-button"
            disabled={cart.length === 0 || isPlacingOrder}
          >
            {isPlacingOrder ? "Placing Order..." : `Place Order · ₹${totalPrice}`}
          </button>
        </form>

        <div className="order-summary">
          <h3>Your Order</h3>

          {cart.map((item) => (
            <div className="summary-item" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <strong>Total</strong>
            <strong>₹{totalPrice}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Checkout;
