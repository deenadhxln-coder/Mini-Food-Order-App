function Footer({ onNavigateMenu, onNavigateOrders, onNavigateCart, totalItems = 0 }) {
  function handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <h3 className="footer-logo">Foodie 🍔</h3>
          <p className="footer-tagline">
            Discover and order your next favourite meal. Fast delivery, fresh ingredients, and great taste in every single bite.
          </p>
          <div className="footer-badge">
            <span className="status-dot"></span> Open Daily: 10:00 AM - 11:00 PM
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Navigation</h4>
          <ul className="footer-links">
            <li>
              <button type="button" className="footer-link-btn" onClick={onNavigateMenu}>
                🍽️ Buy Foods / Menu
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={onNavigateOrders}>
                📦 My Orders
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={onNavigateCart}>
                🛒 Cart ({totalItems})
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={handleScrollToTop}>
                ↑ Back to Top
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul className="footer-info">
            <li>⚡ <strong>Express Delivery:</strong> Within 30-45 minutes</li>
            <li>📞 <strong>Support:</strong> +91 98765 43210</li>
            <li>✉️ <strong>Email:</strong> support@foodie.com</li>
            <li>🛡️ <strong>Safety:</strong> 100% Hygienic & Contactless Delivery</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Foodie Inc. All rights reserved. Made with ❤️ for food lovers.</p>
      </div>
    </footer>
  );
}

export default Footer;
