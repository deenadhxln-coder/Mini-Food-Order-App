import FoodCard from "./foodcard.jsx";
function FoodList({ foods, onAddToCart, cart = [], updatingItemId = null, onIncrease, onDecrease }) {
  if (foods.length === 0) {
    return <p className="empty-message">No food items found.</p>;
  }

  return (
    <div className="food-grid">
      {foods.map((food) => {
        const foodId = food.id || food._id;
        const cartItem = cart.find((item) => (item.id || item._id) === foodId);
        const quantity = cartItem ? cartItem.quantity : 0;

        return (
          <FoodCard
            key={foodId}
            food={food}
            quantity={quantity}
            isUpdating={updatingItemId === foodId}
            onAddToCart={onAddToCart}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
        );
      })}
    </div>
  );
}

export default FoodList;
