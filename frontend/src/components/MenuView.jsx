import SearchFilter from "./SearchFilter";
import FoodList from "./FoodList";

function MenuView({
  search,
  setSearch,
  category,
  setCategory,
  sortOrder,
  setSortOrder,
  foods,
  loading,
  error,
  onAddToCart,
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
      />

      <p className="results-count">
        Showing {foods.length} food items
      </p>

      {loading ? (
        <p>Loading delicious food...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <FoodList foods={foods} onAddToCart={onAddToCart} />
      )}
    </section>
  );
}

export default MenuView;
