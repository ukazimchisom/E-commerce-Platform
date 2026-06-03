"use client";

import { useEffect, useRef, useState } from "react";
import { useProducts } from "@/hooks/useProduct";
import ProductCard from "@/components/ui/ProductCard";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { Search, X } from "lucide-react";

export default function ProductsPage() {
  const {
    products,
    categories,
    isLoading,
    isSearching,
    total,
    query,
    selectedCategory,
    setQuery,
    setSelectedCategory,
    loadMore,
    hasMore,
  } = useProducts();

  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input by 400ms
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(value);
    }, 400);
  };

  const clearSearch = () => {
    setInputValue("");
    setQuery("");
  };

  // Sync inputValue if query is cleared externally (e.g., category click)
  useEffect(() => {
    if (!query) setInputValue("");
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 mt-1">
          {isLoading ? "Loading..." : `${total} products available`}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={inputValue}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          {inputValue && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="sm:w-56 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Active filter chips */}
      {(query || selectedCategory) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-gray-500">Filtering by:</span>
          {query && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              &ldquo;{query}&rdquo;
              <button onClick={clearSearch} className="hover:text-blue-900">
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory("")}
                className="hover:text-blue-900"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <SkeletonGrid count={20} />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            query
              ? `No results for "${query}". Try a different search term.`
              : "No products in this category yet."
          }
          action={
            <Button variant="outline" onClick={clearSearch}>
              Clear filters
            </Button>
          }
          icon={<Search className="h-8 w-8" strokeWidth={1.5} />}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          {hasMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                isLoading={isSearching}
              >
                {isSearching ? "Loading..." : "Load more products"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
