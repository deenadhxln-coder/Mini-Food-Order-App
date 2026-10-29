import SearchFilter from "./SearchFilter";
import FoodList from "./FoodList";

function MenuView({
  search,
  setSearch,
  category,
  setCategory,
  sortOrder,
  setSortOrder,
  categories = ["All"],
  foods,
  loading,
  error,
  cart = [],
  onAddToCart,
  onIncrease,
  onDecrease,
}) {
  return (
    <section>
      <h2>Our Menu</h2>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        categories={categories}
      />

      <p className="results-count">
        Showing {foods.length} food items
      </p>

      {loading ? (
        <p>Loading delicious food...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <FoodList
          foods={foods}
          cart={cart}
          onAddToCart={onAddToCart}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      )}
    </section>
  );
}

export default MenuView;
