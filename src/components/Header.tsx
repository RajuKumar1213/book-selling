"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/contexts/CategoriesContext";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import { useTypewriterPlaceholder } from "@/hooks/useTypewriterPlaceholder";

import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  MoreHorizontal,
  Plus,
  Minus,
  Package,
  Info,
  LogIn,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Login from "./Login";
import SearchDropdown from "./SearchDropdown";
import BookNavigation from "./BookNavigation";

const phrases = [
  "your favorite book",
  "your favorite author",
  "timeless classics",
  "new releases",
  "bestsellers under ₹299",
];

const products = [
  {
    _id: "book_1",
    name: "To Kill a Mockingbird",
    shortDescription:
      "A timeless self-help masterpiece exploring themes of adventure and human nature.",
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/g/e/c/to-kill-a-mockingbird-harper-lee-original-imaheya2dhgjbfd4.jpeg?q=70",
    price: 211,
    discountPrice: undefined,
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/d/t/3/bookey-pride-prejudice-jane-austen-s-timeless-tale-of-love-and-original-imagmu4fcfvvyay2.jpeg?q=70",
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/book/0/4/6/the-count-of-monte-cristo-original-imadtdzacwqkkwyx.jpeg?q=70",
    price: 505,
    discountPrice: undefined,
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
    discountPrice: undefined,
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/h/a/a/moby-dick-english-comics-book-written-by-herman-melville-original-imahegwfzktkgav8.jpeg?q=70",
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
    discountPrice: undefined,
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/o/t/5/1984-original-imah9fnyzr4h6jad.jpeg?q=70",
    price: 327,
    discountPrice: undefined,
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/kvtuxe80/book/2/7/5/the-prophet-premium-paperback-penguin-india-original-imag8n8uch847hfp.jpeg?q=70",
    price: 751,
    discountPrice: undefined,
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/k/v/b/the-power-of-now-a-guide-to-spiritual-enlightenment-original-imahf9jjjyq8e73t.jpeg?q=70",
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/8/8/a/anna-karenina-original-imah436r7safwkkz.jpeg?q=70",
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/k/m/d/tao-te-ching-bhag-1-hindi-by-acharya-prashant-original-imahbpwyrcrmx2nu.jpeg?q=70",
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
    imageUrl: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/a/t/j/the-book-on-the-taboo-against-knowing-who-you-are-original-imagkqffqnxf4fb6.jpeg?q=70",
    price: 689,
    discountPrice: undefined,
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

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { groupedCategories, loading: categoriesLoading } = useCategories();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const rightSidebarRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
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

  // Check if current page is home page, search page, product page, or cart page

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(null);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".mobile-menu-trigger")
      ) {
        setIsMobileMenuOpen(false);
      }
      if (
        rightSidebarRef.current &&
        !rightSidebarRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".right-sidebar-trigger")
      ) {
        setIsRightSidebarOpen(false);
      }
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

  const handleCategoryClick = (categorySlug: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(null);
    setIsMobileMenuOpen(false);
    router.push(`/${categorySlug}`);
  };

  const handleDropdown = (menu: string) => {
    setIsDropdownOpen(menu);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(
      expandedCategory === categoryName ? null : categoryName
    );
  };

  const animatedPlaceholder = useTypewriterPlaceholder(phrases, {
    active: !isFocused && searchQuery.length === 0, // pause when typing/focused
    typingSpeed: 110,
    deletingSpeed: 110,
    pauseMs: 1000,
  });

  return (
    <>
      <header className="bg-white relative z-50">
        {" "}
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-amber-50 shadow-md border-b border-purple-100">
          {/* Left side - Hamburger + Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-trigger p-2.5 hover:bg-gradient-to-r hover:from-purple-200 hover:to-amber-200 rounded-none transition-all duration-300 transform hover:scale-110 group"
            >
              <Menu className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
            </button>
            <div
              className="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => router.push("/")}
            >
              <Image
                src="/oxford-logo.png"
                alt="book logo"
                width={120}
                height={32}
                priority
                className="drop-shadow-lg"
              />
            </div>
          </div>{" "}
          {/* Right side - Icons */}
          <div className="flex items-center space-x-1">
            <Link href="/wishlist">
              <button className="p-2.5 hover:bg-gradient-to-r hover:from-purple-200 hover:to-amber-200 rounded-none transition-all duration-300 transform hover:scale-110 group">
                <Heart className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
              </button>
            </Link>
            <Link href="/m-search">
              <button className="p-2.5 hover:bg-gradient-to-r hover:from-purple-200 hover:to-amber-200 rounded-none transition-all duration-300 transform hover:scale-110 group">
                <Search className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
              </button>
            </Link>
            <Link href="/cart">
              <button className="p-2.5 hover:bg-gradient-to-r hover:from-purple-200 hover:to-amber-200 rounded-none transition-all duration-300 transform hover:scale-110 relative group">
                <ShoppingCart className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {totalItems}
                  </span>
                )}
              </button>
            </Link>
            <button
              className="p-2.5 hover:bg-gradient-to-r hover:from-purple-200 hover:to-amber-200 rounded-none transition-all duration-300 transform hover:scale-110 right-sidebar-trigger group"
              onClick={() => setIsRightSidebarOpen(true)}
              aria-label="Open more menu"
            >
              <MoreHorizontal className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
            </button>
          </div>{" "}
        </div>
        {/* Desktop Header */}
        <div className="hidden lg:block">
          {/* Main header */}
          <div className="bg-white shadow-lg min-w-screen mx-auto py-5 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-opacity-90">
            <div className="container mx-auto px-8 flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
                onClick={() => router.push("/")}
              >
                <Image
                  src="/oxford-logo.png"
                  alt="cakes wow Logo"
                  width={150}
                  height={60}
                  className="drop-shadow-md"
                />
              </div>

              {/* Location */}

              {/* Search */}
              <div className="flex-1 max-w-[500px] mx-8" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={
                        animatedPlaceholder
                          ? `Search for ${animatedPlaceholder}`
                          : "Search books, authors, genres…"
                      }
                      value={searchQuery}
                      onChange={(e) => handleQueryChange(e.target.value)}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleSearchKeyDown}
                      className="w-full pl-12 pr-4 py-3 text-sm text-gray-700 bg-white border border-purple-200 rounded-none focus:outline-none  transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />

                    {searchLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>

                  {showSuggestions && (
                    <SearchDropdown
                      products={products}
                      query={suggestions.query}
                      isLoading={searchLoading}
                      selectedIndex={selectedIndex}
                      onProductClick={handleProductClick}
                      onViewAllResults={handleViewAllResults}
                      onPopularSearchClick={handlePopularSearchClick}
                    />
                  )}
                </form>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-6">
                {user ? (
                  <div className="flex items-center space-x-6">
                    <div
                      className="flex items-center space-x-2 cursor-pointer group"
                      onClick={() => router.push("/profile")}
                    >
                      <div className="p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                        Profile
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <div className="p-2 rounded-full bg-gray-100 hover:bg-purple-100 transition-colors">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => setShowLogin(true)}
                  >
                    <div className="p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                      Login
                    </span>
                  </div>
                )}

                <div
                  className="flex items-center space-x-2 cursor-pointer group relative"
                  onClick={() => router.push("/cart")}
                >
                  <div className="p-2 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                    <ShoppingCart className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                    Cart
                  </span>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          {/* <nav
            className="bg-gradient-to-r from-purple-50 to-amber-50 shadow-sm mt-21 relative z-40 border-t border-purple-100"
            ref={dropdownRef}
          >
            <div className="container mx-auto px-2 flex items-center justify-center relative">
              <div className="flex items-center justify-start flex-wrap space-x-4 py-2 nav-scroll-container">
                {!categoriesLoading &&
                  Object.keys(groupedCategories).map((group) => {
                    const categoriesByType = groupedCategories[group].reduce(
                      (acc: any, category) => {
                        const type = category.type;
                        if (!acc[type]) {
                          acc[type] = [];
                        }
                        acc[type].push(category);
                        return acc;
                      },
                      {}
                    );

                    return (
                      <div
                        key={group}
                        className="relative flex-shrink-0"
                        onMouseEnter={() => {
                          if (groupedCategories[group].length > 1) {
                            handleDropdown(group.toLowerCase());
                          }
                        }}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button
                          className="flex text-sm font-extrabold items-center space-x-1 hover:text-purple-600 whitespace-nowrap px-2 py-[6px] transition-colors duration-200 group"
                          onClick={(e) => {
                            if (groupedCategories[group].length === 1) {
                              handleCategoryClick(
                                groupedCategories[group][0].slug,
                                e
                              );
                            }
                          }}
                        >
                          <span className="  group-hover:text-purple-600 transition-colors">
                            {group}
                          </span>
                        </button>

                        {isDropdownOpen === group.toLowerCase() &&
                          groupedCategories[group].length > 1 && (
                            <div
                              className={`absolute top-full ${
                                group === "Famous Character Cake"
                                  ? "-left-80"
                                  : "-left-1"
                              } bg-white backdrop-blur-lg shadow-xl rounded-none border border-purple-100 overflow-hidden`}
                              style={{
                                boxShadow:
                                  "0 20px 40px rgba(249, 168, 212, 0.2), 0 0 20px rgba(249, 168, 212, 0.1)",
                                zIndex: 9999,
                              }}
                            >
                              <div>
                                {Object.keys(categoriesByType).length > 1 ? (
                                  <div className="flex flex-row gap-4">
                                    {Object.entries(categoriesByType).map(
                                      (
                                        [type, typeCategories]: [string, any],
                                        index: number
                                      ) => (
                                        <div
                                          key={type}
                                          className={`w-60 p-2 relative overflow-hidden ${
                                            index % 2 === 0
                                              ? "bg-gradient-to-br from-purple-50 to-amber-50"
                                              : "bg-white"
                                          }`}
                                        >
                                          <div className="p-4">
                                            <h3 className="text-sm font-bold text-purple-600 mb-2 border-b border-purple-200 pb-2 whitespace-nowrap">
                                              {type}
                                            </h3>
                                            <div className="">
                                              {typeCategories.map(
                                                (category: any) => (
                                                  <button
                                                    key={category._id}
                                                    onClick={(e) =>
                                                      handleCategoryClick(
                                                        category.slug,
                                                        e
                                                      )
                                                    }
                                                    className="flex text-left py-2 px-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-amber-100 hover:text-purple-700 rounded-none transition-all duration-300 font-medium whitespace-nowrap line-clamp-1 w-full hover:shadow-sm transform hover:scale-105"
                                                  >
                                                    {category.name}
                                                  </button>
                                                )
                                              )}
                                              <div className="flex-grow" />
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="p-3 flex flex-col">
                                    {groupedCategories[group].map(
                                      (category) => (
                                        <button
                                          key={category._id}
                                          onClick={(e) =>
                                            handleCategoryClick(
                                              category.slug,
                                              e
                                            )
                                          }
                                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-amber-100 hover:text-purple-700 rounded-none transition-all duration-300 font-medium whitespace-nowrap transform hover:scale-105 hover:shadow-sm"
                                        >
                                          {category.name}
                                        </button>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    );
                  })}
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-purple-50/50 to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-amber-50/50 to-transparent pointer-events-none z-10"></div>
            </div>
          </nav> */}

          <BookNavigation/>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 transition-opacity duration-300">
          <div
            ref={mobileMenuRef}
            className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-purple-50 to-amber-50 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
            style={{
              transform: isMobileMenuOpen
                ? "translateX(0)"
                : "translateX(-100%)",
            }}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-white">
              <Image
                src="/logo.webp"
                alt="cakes wow Logo"
                width={120}
                height={20}
                className="cursor-pointer mr-8"
                onClick={() => router.push("/")}
              />
              <button
                onClick={toggleMobileMenu}
                className="p-2 hover:bg-purple-100 rounded-none transition-colors"
              >
                <X className="w-6 h-6 text-purple-600" />
              </button>
            </div>

            {/* Mobile Menu Items */}
            <div className="py-2">
              {!categoriesLoading &&
                Object.keys(groupedCategories).map((group) => (
                  <div
                    key={group}
                    className="border-b border-purple-100 last:border-b-0"
                  >
                    {groupedCategories[group].length > 1 ? (
                      <>
                        <button
                          onClick={() => toggleCategory(group)}
                          className="w-full flex items-center justify-between p-4 hover:bg-purple-50 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-800">
                            {group}
                          </span>
                          {expandedCategory === group ? (
                            <Minus className="w-5 h-5 text-purple-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-purple-500" />
                          )}
                        </button>

                        {expandedCategory === group && (
                          <div className="bg-white border-t border-purple-200">
                            <div className="p-4">
                              {groupedCategories[group].map((category) => (
                                <button
                                  key={category._id}
                                  onClick={(e) =>
                                    handleCategoryClick(category.slug, e)
                                  }
                                  className="block w-full text-left text-sm text-gray-600 hover:text-purple-600 py-2 px-4 hover:bg-purple-50 rounded-none transition-colors"
                                >
                                  {category.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleCategoryClick(
                            groupedCategories[group][0].slug,
                            e
                          )
                        }
                        className="block w-full text-left p-4 hover:bg-purple-50 transition-colors font-medium text-gray-800"
                      >
                        {group}
                      </button>
                    )}
                  </div>
                ))}
            </div>

            {/* User Actions in Mobile Menu */}
            <div className="p-4 border-t border-purple-200 space-y-3 bg-white">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      router.push("/orders");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-none transition-colors"
                  >
                    <Package className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-800">My Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-none transition-colors"
                  >
                    <User className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-800">Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-none transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-800">Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-none transition-colors"
                >
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-800">
                    Login/Signup
                  </span>
                </button>
              )}
              <button
                onClick={() => {
                  router.push("/wishlist");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 p-3 hover:bg-purple-50 rounded-none transition-colors"
              >
                <Heart className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-800">Wishlist</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar Overlay */}
      {isRightSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300">
          <div
            ref={rightSidebarRef}
            className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-gradient-to-b from-purple-50 to-amber-50 shadow-2xl transform transition-transform duration-300 ease-out overflow-y-auto"
            style={{
              transform: isRightSidebarOpen
                ? "translateX(0)"
                : "translateX(100%)",
            }}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-200 bg-white">
              <h2 className="text-xl font-bold text-purple-600">Menu</h2>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="p-2 hover:bg-purple-100 rounded-none transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-6 h-6 text-purple-600" />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="p-6 flex flex-col space-y-6">
              {/* Login (if no user) */}
              {!user && (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsRightSidebarOpen(false);
                  }}
                  className="flex items-center space-x-3 justify-center w-full py-4 bg-gradient-to-r from-purple-100 to-amber-100 rounded-none hover:from-purple-200 hover:to-amber-200 transition-colors shadow-md"
                >
                  <LogIn className="w-8 h-8 text-purple-600" />
                  <span className="text-2xl font-bold text-purple-600">
                    Login
                  </span>
                </button>
              )}

              {/* My Orders */}
              {user && (
                <button
                  onClick={() => {
                    router.push("/orders");
                    setIsRightSidebarOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full py-3 px-4 rounded-none hover:bg-purple-50 transition-colors text-lg font-medium text-gray-800 justify-start"
                >
                  <Package className="w-6 h-6 text-purple-600" />
                  <span>My Orders</span>
                </button>
              )}

              {/* Track Order */}
              {user && (
                <button className="flex items-center space-x-3 w-full py-3 px-4 rounded-none hover:bg-purple-50 transition-colors text-lg font-medium text-gray-800 justify-start">
                  <Package className="w-6 h-6 text-purple-600" />
                  <span>Track Order</span>
                </button>
              )}

              {/* About Us */}
              <button className="flex items-center space-x-3 w-full py-3 px-4 rounded-none hover:bg-purple-50 transition-colors text-lg font-medium text-gray-800 justify-start">
                <Info className="w-6 h-6 text-purple-600" />
                <span>About Us</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogin && <Login setShowLogin={setShowLogin} isVisible={showLogin} />}
    </>
  );
};

export default Header;
