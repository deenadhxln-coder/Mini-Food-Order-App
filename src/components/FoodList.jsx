import FoodCard from "./foodcard.jsx";
function FoodList({ foods, onAddToCart }) {
  if (foods.length === 0) {
    return <p className="empty-message">No food items found.</p>;
  }

  return (
    <div className="food-grid">
      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default FoodList;
