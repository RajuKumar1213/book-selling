"use client";

import {
  Search,
  ArrowLeft,
  Sparkles,
  Heart,
  Star,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import SearchDropdown from "@/components/SearchDropdown";

const products = [
  {
    _id: "book_1",
    name: "To Kill a Mockingbird",
    shortDescription:
      "A timeless self-help masterpiece exploring themes of adventure and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/g/e/c/to-kill-a-mockingbird-harper-lee-original-imaheya2dhgjbfd4.jpeg?q=70",
    price: 211,
    discountPrice: null,
    slug: "to-kill-a-mockingbird-841",
    category: "Self-Help",
    categorySlug: "self-help",
    formatOptions: [
      {
        format: "Paperback",
        price: 375,
        discountedPrice: 302,
      },
      {
        format: "Hardcover",
        price: 561,
      },
      {
        format: "Ebook",
        price: 196,
      },
    ],
    rating: 4.3,
    reviewCount: 368,
    firstFormatOption: {
      format: "Paperback",
      price: 375,
      discountedPrice: 302,
    },
  },
  {
    _id: "book_2",
    name: "Pride and Prejudice",
    shortDescription:
      "A timeless fiction masterpiece exploring themes of life and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/book/d/t/3/bookey-pride-prejudice-jane-austen-s-timeless-tale-of-love-and-original-imagmu4fcfvvyay2.jpeg?q=70",
    price: 516,
    discountPrice: 325,
    slug: "pride-and-prejudice-406",
    category: "Fiction",
    categorySlug: "fiction",
    formatOptions: [
      {
        format: "Paperback",
        price: 391,
      },
      {
        format: "Hardcover",
        price: 649,
      },
      {
        format: "Ebook",
        price: 158,
      },
    ],
    rating: 4.2,
    reviewCount: 409,
    firstFormatOption: {
      format: "Paperback",
      price: 391,
    },
  },
  {
    _id: "book_3",
    name: "The Count of Monte Cristo",
    shortDescription:
      "A timeless biography masterpiece exploring themes of self-discovery and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/book/0/4/6/the-count-of-monte-cristo-original-imadtdzacwqkkwyx.jpeg?q=70",
    price: 505,
    discountPrice: null,
    slug: "the-count-of-monte-cristo-129",
    category: "Biography",
    categorySlug: "biography",
    formatOptions: [
      {
        format: "Paperback",
        price: 354,
      },
      {
        format: "Hardcover",
        price: 416,
      },
      {
        format: "Ebook",
        price: 103,
      },
    ],
    rating: 4.4,
    reviewCount: 568,
    firstFormatOption: {
      format: "Paperback",
      price: 354,
    },
  },
  {
    _id: "book_4",
    name: "The Iliad",
    shortDescription:
      "A timeless philosophy masterpiece exploring themes of love and human nature.",
    imageUrl: "https://picsum.photos/200/300?random=3",
    price: 524,
    discountPrice: null,
    slug: "the-iliad-495",
    category: "Philosophy",
    categorySlug: "philosophy",
    formatOptions: [
      {
        format: "Paperback",
        price: 223,
        discountedPrice: 129,
      },
      {
        format: "Hardcover",
        price: 525,
      },
      {
        format: "Ebook",
        price: 207,
      },
    ],
    rating: 4.9,
    reviewCount: 837,
    firstFormatOption: {
      format: "Paperback",
      price: 223,
      discountedPrice: 129,
    },
  },
  {
    _id: "book_5",
    name: "Moby-Dick",
    shortDescription:
      "A timeless philosophy masterpiece exploring themes of life and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/h/a/a/moby-dick-english-comics-book-written-by-herman-melville-original-imahegwfzktkgav8.jpeg?q=70",
    price: 212,
    discountPrice: 161,
    slug: "moby-dick-889",
    category: "Philosophy",
    categorySlug: "philosophy",
    formatOptions: [
      {
        format: "Paperback",
        price: 294,
        discountedPrice: 208,
      },
      {
        format: "Hardcover",
        price: 659,
      },
      {
        format: "Ebook",
        price: 227,
      },
    ],
    rating: 4.3,
    reviewCount: 764,
    firstFormatOption: {
      format: "Paperback",
      price: 294,
      discountedPrice: 208,
    },
  },

  {
    _id: "book_7",
    name: "The Catcher in the Rye",
    shortDescription:
      "A timeless literature masterpiece exploring themes of love and human nature.",
    imageUrl: "https://picsum.photos/200/300?random=6",
    price: 484,
    discountPrice: null,
    slug: "the-catcher-in-the-rye-229",
    category: "Literature",
    categorySlug: "literature",
    formatOptions: [
      {
        format: "Paperback",
        price: 232,
        discountedPrice: 143,
      },
      {
        format: "Hardcover",
        price: 676,
      },
      {
        format: "Ebook",
        price: 275,
      },
    ],
    rating: 3.7,
    reviewCount: 178,
    firstFormatOption: {
      format: "Paperback",
      price: 232,
      discountedPrice: 143,
    },
  },
  {
    _id: "book_8",
    name: "1984",
    shortDescription:
      "A timeless spiritual masterpiece exploring themes of adventure and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/book/o/t/5/1984-original-imah9fnyzr4h6jad.jpeg?q=70",
    price: 327,
    discountPrice: null,
    slug: "1984-444",
    category: "Spiritual",
    categorySlug: "spiritual",
    formatOptions: [
      {
        format: "Paperback",
        price: 362,
        discountedPrice: 276,
      },
      {
        format: "Hardcover",
        price: 598,
      },
      {
        format: "Ebook",
        price: 167,
      },
    ],
    rating: 4.8,
    reviewCount: 878,
    firstFormatOption: {
      format: "Paperback",
      price: 362,
      discountedPrice: 276,
    },
  },
  {
    _id: "book_9",
    name: "The Prophet",
    shortDescription:
      "A timeless philosophy masterpiece exploring themes of adventure and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/kvtuxe80/book/2/7/5/the-prophet-premium-paperback-penguin-india-original-imag8n8uch847hfp.jpeg?q=70",
    price: 751,
    discountPrice: null,
    slug: "the-prophet-806",
    category: "Philosophy",
    categorySlug: "philosophy",
    formatOptions: [
      {
        format: "Paperback",
        price: 412,
      },
      {
        format: "Hardcover",
        price: 737,
      },
      {
        format: "Ebook",
        price: 191,
      },
    ],
    rating: 4.3,
    reviewCount: 336,
    firstFormatOption: {
      format: "Paperback",
      price: 412,
    },
  },
  {
    _id: "book_10",
    name: "The Power of Now",
    shortDescription:
      "A timeless biography masterpiece exploring themes of life and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/book/k/v/b/the-power-of-now-a-guide-to-spiritual-enlightenment-original-imahf9jjjyq8e73t.jpeg?q=70",
    price: 757,
    discountPrice: 274,
    slug: "the-power-of-now-415",
    category: "Biography",
    categorySlug: "biography",
    formatOptions: [
      {
        format: "Paperback",
        price: 303,
        discountedPrice: 222,
      },
      {
        format: "Hardcover",
        price: 663,
      },
      {
        format: "Ebook",
        price: 146,
      },
    ],
    rating: 4.4,
    reviewCount: 113,
    firstFormatOption: {
      format: "Paperback",
      price: 303,
      discountedPrice: 222,
    },
  },
  {
    _id: "book_11",
    name: "Anna Karenina",
    shortDescription:
      "A timeless classics masterpiece exploring themes of self-discovery and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/book/8/8/a/anna-karenina-original-imah436r7safwkkz.jpeg?q=70",
    price: 557,
    discountPrice: 287,
    slug: "anna-karenina-804",
    category: "Classics",
    categorySlug: "classics",
    formatOptions: [
      {
        format: "Paperback",
        price: 242,
      },
      {
        format: "Hardcover",
        price: 683,
      },
      {
        format: "Ebook",
        price: 298,
      },
    ],
    rating: 4.2,
    reviewCount: 979,
    firstFormatOption: {
      format: "Paperback",
      price: 242,
    },
  },

  {
    _id: "book_13",
    name: "Tao Te Ching",
    shortDescription:
      "A timeless self-help masterpiece exploring themes of adventure and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/book/k/m/d/tao-te-ching-bhag-1-hindi-by-acharya-prashant-original-imahbpwyrcrmx2nu.jpeg?q=70",
    price: 424,
    discountPrice: 150,
    slug: "tao-te-ching-304",
    category: "Self-Help",
    categorySlug: "self-help",
    formatOptions: [
      {
        format: "Paperback",
        price: 466,
      },
      {
        format: "Hardcover",
        price: 471,
      },
      {
        format: "Ebook",
        price: 298,
      },
    ],
    rating: 4.3,
    reviewCount: 629,
    firstFormatOption: {
      format: "Paperback",
      price: 466,
    },
  },

  {
    _id: "book_15",
    name: "The Book: On the Taboo Against Knowing Who You Are",
    shortDescription:
      "A timeless philosophy masterpiece exploring themes of society and human nature.",
    imageUrl:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/book/a/t/j/the-book-on-the-taboo-against-knowing-who-you-are-original-imagkqffqnxf4fb6.jpeg?q=70",
    price: 689,
    discountPrice: null,
    slug: "the-book:-on-the-taboo-against-knowing-who-you-are-669",
    category: "Philosophy",
    categorySlug: "philosophy",
    formatOptions: [
      {
        format: "Paperback",
        price: 446,
      },
      {
        format: "Hardcover",
        price: 531,
      },
      {
        format: "Ebook",
        price: 107,
      },
    ],
    rating: 4.6,
    reviewCount: 470,
    firstFormatOption: {
      format: "Paperback",
      price: 446,
    },
  },
];

export default function MobileSearchPage() {
  const router = useRouter();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  // Real-time search functionality
  const {
    query: searchQuery,
    suggestions,
    isLoading: searchLoading,
    showSuggestions,
    selectedIndex,
    handleQueryChange,
    handleKeyboardNavigation,
    clearSuggestions,
    setShowSuggestions,
  } = useSearchSuggestions();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      clearSuggestions();
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const result = handleKeyboardNavigation(e.key);

    if (result === "handled") {
      e.preventDefault();
    } else if (result && typeof result === "object") {
      e.preventDefault();
      clearSuggestions();
      router.push(`/products/${result.slug}`);
    }
  };

  const handleProductClick = (slug: string) => {
    clearSuggestions();
  };

  const handleViewAllResults = () => {
    clearSuggestions();
  };

  const handlePopularSearchClick = (term: string) => {
    handleQueryChange(term);
    clearSuggestions();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowSuggestions]);

  const trendingSearches = [
    { text: "Fiction", icon: Heart, color: "bg-pink-500" },
    { text: "Self-Help", icon: Sparkles, color: "bg-purple-500" },
    { text: "Classics", icon: Star, color: "bg-red-500" },
    { text: "Biography", icon: TrendingUp, color: "bg-blue-500" },
  ];
  const recentSearches = [
    "Best Sellers",
    "New Releases",
    "Fiction Books",
    "Non-Fiction",
  ];

  return (
    <div className="md:hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header with Back Button */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-800">Search Books</h1>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2 pt-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative mb-8" ref={searchRef}>
          <div
            className={`relative transition-all duration-300 ${
              isInputFocused ? "transform scale-105" : ""
            }`}
          >
            {/* <span className="absolute left-6 top-1/2 -translate-y-1/2 z-10">
              <Search className="w-5 h-5 text-gray-400" />
            </span> */}
            <input
              type="text"
              placeholder="Search for your next favorite book 📖"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => {
                setIsInputFocused(true);
                setShowSuggestions(true);
              }}
              onBlur={() => setIsInputFocused(false)}
              className={`w-full pl-4 pr-14 py-3 bg-white rounded-none shadow-lg border-2 transition-all duration-300 text-gray-800 placeholder-gray-400 text-lg ${
                isInputFocused
                  ? "border-blue-300 shadow-blue-200/50"
                  : "border-gray-100 hover:border-blue-200"
              } focus:outline-none focus:border-blue-400 focus:shadow-xl focus:shadow-blue-200/30`}
              autoFocus
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2.5 rounded-xl transition-all duration-300 ${
                searchQuery.trim()
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl"
                  : ""
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {searchLoading && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1">
              <SearchDropdown
                products={products}
                query={suggestions.query}
                isLoading={searchLoading}
                selectedIndex={selectedIndex}
                onProductClick={(slug) => {
                  handleProductClick(slug);
                  setShowSuggestions(false);
                  router.push(`/products/${slug}`);
                }}
                onViewAllResults={() => {
                  handleViewAllResults();
                  setShowSuggestions(false);
                }}
                onPopularSearchClick={(term) => {
                  handlePopularSearchClick(term);
                  setShowSuggestions(false);
                }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
