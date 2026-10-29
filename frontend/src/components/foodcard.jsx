
import { StarIcon } from "./Icons";

function FoodCard({ food, quantity = 0, isUpdating = false, onAddToCart, onIncrease, onDecrease }) {
  const foodId = food.id || food._id;

  return (
    <article className="food-card">
      <img
        src={food.image}
        alt={food.name}
        className="food-image"
      />

      <div className="food-details">
        <span className="food-category">
          {food.category}
        </span>

        <h3>{food.name}</h3>

        <p className="food-description">
          {food.description}
        </p>

        <p className="food-rating">
          <StarIcon size={14} color="#f59e0b" />
          <span>{food.rating}</span>
        </p>

        <div className="food-card-footer">
          <strong>₹{food.price}</strong>

          {quantity > 0 ? (
            <div className="card-quantity-controls">
              <button
                type="button"
                onClick={() => onDecrease(foodId)}
                aria-label={`Decrease ${food.name} quantity`}
                disabled={isUpdating}
              >
                −
              </button>
              <span className="quantity-value">
                {quantity}
                {isUpdating && <span className="app-spinner app-spinner-sm" aria-label="Updating" />}
              </span>
              <button
                type="button"
                onClick={() => onIncrease(foodId)}
                aria-label={`Increase ${food.name} quantity`}
                disabled={isUpdating}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(food)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="btn-spinner-wrap">
                  <span className="app-spinner app-spinner-sm btn-spinner" aria-hidden="true" />
                  Adding...
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
