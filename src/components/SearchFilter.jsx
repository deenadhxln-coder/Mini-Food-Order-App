
function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Pizza">Pizza</option>
        <option value="Burger">Burger</option>
        <option value="Drinks">Drinks</option>
        <option value="Desserts">Desserts</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="default">Sort by Price</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>
    </div>
  );
}

export default SearchFilter;
