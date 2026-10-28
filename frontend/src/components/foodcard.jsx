
function FoodCard({ food, quantity = 0, onAddToCart, onIncrease, onDecrease }) {
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
          ⭐ {food.rating}
        </p>

        <div className="food-card-footer">
          <strong>₹{food.price}</strong>

          {quantity > 0 ? (
            <div className="card-quantity-controls">
              <button
                type="button"
                onClick={() => onDecrease(foodId)}
                aria-label={`Decrease ${food.name} quantity`}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => onIncrease(foodId)}
                aria-label={`Increase ${food.name} quantity`}
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAddToCart(food)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
