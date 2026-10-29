import {
  BurgerIcon,
  UtensilsIcon,
  PackageIcon,
  CartIcon,
  LightningIcon,
  PhoneIcon,
  MailIcon,
  ShieldIcon,
  HeartIcon,
} from "./Icons";

function Footer({ onNavigateMenu, onNavigateOrders, onNavigateCart, totalItems = 0 }) {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <h3 className="footer-logo">
            Foodie <BurgerIcon size={22} />
          </h3>
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
                <UtensilsIcon size={16} />
                <span>Buy Foods / Menu</span>
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={onNavigateOrders}>
                <PackageIcon size={16} />
                <span>My Orders</span>
              </button>
            </li>
            <li>
              <button type="button" className="footer-link-btn" onClick={onNavigateCart}>
                <CartIcon size={16} />
                <span>Cart ({totalItems})</span>
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul className="footer-info">
            <li>
              <LightningIcon size={16} color="#e45b32" />
              <span><strong>Express Delivery:</strong> Within 30-45 minutes</span>
            </li>
            <li>
              <PhoneIcon size={16} color="#e45b32" />
              <span><strong>Support:</strong> +91 98765 43210</span>
            </li>
            <li>
              <MailIcon size={16} color="#e45b32" />
              <span>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@foodie.com" className="footer-email-link">
                  support@foodie.com
                </a>
              </span>
            </li>
            <li>
              <ShieldIcon size={16} color="#e45b32" />
              <span><strong>Safety:</strong> 100% Hygienic & Contactless Delivery</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          <span>© {new Date().getFullYear()} Foodie Inc. All rights reserved. Made with</span>
          <HeartIcon size={14} color="#ef4444" />
          <span>for food lovers.</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
