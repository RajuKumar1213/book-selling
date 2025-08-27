import React from "react";
import { Search, Loader2, ArrowRight, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchProduct {
  _id: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
  price: number;
  discountPrice?: number;
  slug: string;
  category: string;
  categorySlug: string;
  formatOptions: Array<{
    format: string;
    price: number;
    discountedPrice?: number;
  }>;
  rating: number;
  reviewCount: number;
  firstFormatOption?: {
    format: string;
    price: number;
    discountedPrice?: number;
  };
}

interface SearchDropdownProps {
  products: SearchProduct[];
  query: string;
  isLoading: boolean;
  selectedIndex: number;
  onProductClick: (slug: string) => void;
  onViewAllResults: () => void;
  onPopularSearchClick?: (term: string) => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  products,
  query,
  isLoading,
  selectedIndex,
  onProductClick,
  onViewAllResults,
  onPopularSearchClick,
}) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleProductClick = (slug: string) => {
    onProductClick(slug);
    router.push(`/books/${slug}`);
  };

  return (
    <div className="absolute md:w-2xl  top-full md:-left-20 left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-70px)] overflow-y-auto">
      {/* Show popular searches when query is empty */}
      {!isLoading && query.length === 0 && (
        <div className="p-0">
          <div className="text-center p-4 border-b border-gray-100">
            <Search className="w-6 h-6 text-gray-300 mx-auto mb-2" />
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Search for books
            </h3>
            <p className="text-xs text-gray-500">
              Type to find your perfect read
            </p>
          </div>

          <div className="py-2">
            {[
              "The Fountainhead",
              "Anna Karenina",
              "To Kill a Mockingbird",
              "Man's Search for Meaning",
              "Books by Osho",
              "J. Krishnamurti",
              "Acharya Prashant",
            ].map((term, index) => (
              <button
                key={term}
                className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-200 text-left border-b border-gray-50 last:border-b-0"
                onClick={() => {
                  if (onPopularSearchClick) {
                    onPopularSearchClick(term);
                  }
                }}
              >
                <TrendingUp className="w-4 h-4 text-indigo-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium">
                  {term}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Show hint when typing first character */}
      {!isLoading && query.length === 1 && (
        <div className="text-center p-6">
          <Search className="w-6 h-6 text-gray-300 mx-auto mb-2 animate-pulse" />
          <p className="text-sm text-gray-500">
            Keep typing to see suggestions...
          </p>
        </div>
      )}
      {/* Header */}
      {products.length > 0 && !isLoading && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Search results for "{query}"
            </span>
            <span className="text-xs text-gray-500">
              {products.length} found
            </span>
          </div>
        </div>
      )}
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            <span className="text-sm text-gray-600">Searching...</span>
          </div>
        </div>
      )}
      {/* No Results */}
      {!isLoading && products.length === 0 && query.length >= 2 && (
        <div className="text-center p-8">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            No results found for "{query}"
          </p>
          <p className="text-xs text-gray-400">Try different keywords</p>
        </div>
      )}{" "}
      {/* Products Grid - Responsive */}
      {!isLoading && products.length > 0 && (
        <>
          <div className="p-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {products.map((product, index) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product.slug)}
                  className={`bg-white rounded-none cursor-pointer transition-all duration-200 overflow-hidden ${
                    selectedIndex === index
                      ? "border-indigo-300 ring-2 ring-indigo-100 shadow-lg"
                      : "border-gray-200 hover:border-indigo-200 hover:shadow-md"
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-contain w-full h-[170px]"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="p-2">
                    <h3 className="font-medium text-xs text-gray-900 line-clamp-2  leading-tight">
                      {product.name}
                    </h3>

                    <div className="">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-indigo-600">
                          {formatPrice(product.discountPrice || product.price)}
                        </span>
                        {product.discountPrice && (
                          <span className="text-[10px] line-through text-gray-400">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">
                          {product.rating > 0
                            ? product.rating.toFixed(1)
                            : "New"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchDropdown;
