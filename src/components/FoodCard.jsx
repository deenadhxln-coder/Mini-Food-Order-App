
function FoodCard({ food, onAddToCart }) {
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

          <button
            type="button"
            onClick={() => onAddToCart(food)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;
