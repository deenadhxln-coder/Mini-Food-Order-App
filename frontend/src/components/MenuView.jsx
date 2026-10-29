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
  updatingItemId = null,
  onAddToCart,
  onIncrease,
  onDecrease,
}) {
  return (
    <section id="buy-foods-section" className="menu-section">
      <div className="section-title-wrap">
        <span className="section-tag">MENU CATALOG</span>
        <h2>Explore & Buy Foods</h2>
        <p className="section-desc">
          Choose from our chef-crafted recipes, add to cart, and enjoy fresh doorstep delivery.
        </p>
      </div>

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
        <div className="loading-container">
          <div className="app-spinner app-spinner-lg" aria-hidden="true" />
          <p>Loading delicious food...</p>
        </div>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <FoodList
          foods={foods}
          cart={cart}
          updatingItemId={updatingItemId}
          onAddToCart={onAddToCart}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
      )}
    </section>
  );
}

export default MenuView;
