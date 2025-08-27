"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FeaturedBook {
  _id: string;
  image: string;
  alt: string;
  href: string;
  title: string;
  author: string;
  publishDate: string;
  price: number;
  discountPrice?: number | null;
  isActive: boolean;
  sortOrder: number;
}

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  // const [banners, setBanners] = useState<Banner[]>([]);
  const router = useRouter();

  // Hard-coded featured books data
  const featuredBooks: FeaturedBook[] = [
    {
      _id: "book_1",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/g/e/c/to-kill-a-mockingbird-harper-lee-original-imaheya2dhgjbfd4.jpeg?q=70",
      alt: "To Kill a Mockingbird book cover",
      href: "/products/to-kill-a-mockingbird-841",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      publishDate: "1960",
      price: 375,
      discountPrice: 302,
      isActive: true,
      sortOrder: 1,
    },
    {
      _id: "book_2",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/d/t/3/bookey-pride-prejudice-jane-austen-s-timeless-tale-of-love-and-original-imagmu4fcfvvyay2.jpeg?q=70",
      alt: "Pride and Prejudice book cover",
      href: "/products/pride-and-prejudice-406",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      publishDate: "1813",
      price: 391,
      discountPrice: null,
      isActive: true,
      sortOrder: 2,
    },
    {
      _id: "book_3",
      image:
        "https://rukminim2.flixcart.com/image/612/612/book/0/4/6/the-count-of-monte-cristo-original-imadtdzacwqkkwyx.jpeg?q=70",
      alt: "The Count of Monte Cristo book cover",
      href: "/products/the-count-of-monte-cristo-129",
      title: "The Count of Monte Cristo",
      author: "Alexandre Dumas",
      publishDate: "1844",
      price: 354,
      discountPrice: null,
      isActive: true,
      sortOrder: 3,
    },
    {
      _id: "book_4",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/f/v/w/the-iliad-original-imah4fgysbzzbwrr.jpeg?q=70",
      alt: "The Iliad book cover",
      href: "/products/the-iliad-495",
      title: "The Iliad",
      author: "Homer",
      publishDate: "8th century BCE",
      price: 223,
      discountPrice: 129,
      isActive: true,
      sortOrder: 4,
    },
    {
      _id: "book_5",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/h/a/a/moby-dick-english-comics-book-written-by-herman-melville-original-imahegwfzktkgav8.jpeg?q=70",
      alt: "Moby-Dick book cover",
      href: "/products/moby-dick-889",
      title: "Moby-Dick",
      author: "Herman Melville",
      publishDate: "1851",
      price: 294,
      discountPrice: 208,
      isActive: true,
      sortOrder: 5,
    },
    {
      _id: "book_6",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/o/t/5/1984-original-imah9fnyzr4h6jad.jpeg?q=70",
      alt: "1984 book cover",
      href: "/products/1984-562",
      title: "1984",
      author: "George Orwell",
      publishDate: "1949",
      price: 199,
      discountPrice: 149,
      isActive: true,
      sortOrder: 6,
    },
    {
      _id: "book_7",
      image:
        "https://rukminim2.flixcart.com/image/612/612/kqidx8w0/book/f/h/w/the-little-prince-original-imag4hvmpz69knjk.jpeg?q=70",
      alt: "Sample book 7",
      href: "/products/sample-7",
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      publishDate: "1943",
      price: 179,
      discountPrice: null,
      isActive: true,
      sortOrder: 7,
    },
    {
      _id: "book_8",
      image:
        "https://rukminim2.flixcart.com/image/612/612/l1mh7rk0/book/y/8/6/the-hobbit-original-imagd5phsmwyvbek.jpeg?q=70",
      alt: "The Hobbit book cover",
      href: "/products/the-hobbit-233",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      publishDate: "1937",
      price: 249,
      discountPrice: 199,
      isActive: true,
      sortOrder: 8,
    },
    {
      _id: "book_9",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/v/m/a/sapiens-a-brief-history-of-humankind-original-imah7kfg5mgzsytu.jpeg?q=70",
      alt: "Sample book 9",
      href: "/products/sample-9",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      publishDate: "2011",
      price: 399,
      discountPrice: 329,
      isActive: true,
      sortOrder: 9,
    },
    {
      _id: "book_10",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/e/w/x/atomic-habits-original-imahehg22ghmsxyj.jpeg?q=70",
      alt: "Sample book 10",
      href: "/products/sample-10",
      title: "Atomic Habits",
      author: "James Clear",
      publishDate: "2018",
      price: 499,
      discountPrice: 379,
      isActive: true,
      sortOrder: 10,
    },
    {
      _id: "book_11",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/k/x/u/educated-original-imah39dh9x3h2yg4.jpeg?q=70",
      alt: "Sample book 11",
      href: "/products/sample-11",
      title: "Educated",
      author: "Tara Westover",
      publishDate: "2018",
      price: 329,
      discountPrice: null,
      isActive: true,
      sortOrder: 11,
    },
    {
      _id: "book_12",
      image:
        "https://rukminim2.flixcart.com/image/612/612/xif0q/book/y/t/f/becoming-original-imah56mkjpcpf9p8.jpeg?q=70",
      alt: "Sample book 12",
      href: "/products/sample-12",
      title: "Becoming",
      author: "Michelle Obama",
      publishDate: "2018",
      price: 449,
      discountPrice: 349,
      isActive: true,
      sortOrder: 12,
    },
    // Add more books as needed
  ];

  // Filter active books and sort by sortOrder
  const banners = featuredBooks
    .filter((book) => book.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    setIsMounted(true);

    // Check if we're on a desktop-sized screen
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Commented out API fetch - using hard-coded data instead
  /*
  // Fetch banners from API with caching
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Use fetch with Next.js caching - revalidate every 1 hour (3600 seconds)
        const response = await fetch("/api/hero-banners", {
          next: { revalidate: 300 }, // Cache for 1 hour
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            setBanners(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        // Keep default banners on API failure
      }
    };

    fetchBanners();
  }, []);
  */

  // Calculate maximum slides based on screen size (show 6 cards on desktop, 2 on mobile)
  const maxSlidesMobile = Math.max(0, banners.length - 2);
  const maxSlidesDesktop = Math.max(0, banners.length - 6);
  const getMaxSlides = () => (isDesktop ? maxSlidesDesktop : maxSlidesMobile);

  // Auto-slide timer
  useEffect(() => {
    if (!isMounted || banners.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlides = getMaxSlides();
        if (prev >= maxSlides) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isDesktop, isMounted, banners.length]);

  if (!isMounted || banners.length === 0) {
    return (
      <div className="relative w-full py-4 sm:py-8 md:max-w-7xl md:px-10 mx-auto overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden">
            <div className="flex space-x-1 sm:space-x-3">
              <div className="w-full md:w-1/3 flex-shrink-0 px-1 sm:px-3">
                <div className="relative aspect-[4/5] rounded-none bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                </div>
              </div>
              <div className="hidden md:block w-1/3 flex-shrink-0 px-1 sm:px-3">
                <div className="relative aspect-[4/5] rounded-none bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                </div>
              </div>
              <div className="hidden md:block w-1/3 flex-shrink-0 px-1 sm:px-3">
                <div className="relative aspect-[4/5] rounded-none bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden shadow-lg animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skeleton controls */}
          <div className="flex items-center justify-center mt-4 sm:mt-4 md:mt-6 space-x-2 sm:space-x-4">
            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-gray-200 animate-pulse">
              <div className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gray-300 rounded"></div>
            </div>

            <div className="flex space-x-1 sm:space-x-2">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-300 animate-pulse ${
                    index === 1 ? "scale-125" : ""
                  }`}
                />
              ))}
            </div>

            <div className="p-1.5 sm:p-2 md:p-3 rounded-full bg-gray-200 animate-pulse">
              <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>

        {/* Custom shimmer animation styles */}
        <style jsx>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = getMaxSlides();
      if (prev >= maxSlides) {
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = getMaxSlides();
      if (prev <= 0) {
        return maxSlides;
      }
      return prev - 1;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const getPriceDisplay = (book: FeaturedBook) => {
    if (book.discountPrice) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{book.discountPrice}
          </span>
          <span className="text-lg line-through text-gray-400">
            ₹{book.price}
          </span>
        </div>
      );
    }
    return (
      <span className="text-2xl font-bold text-indigo-600">₹{book.price}</span>
    );
  };

  return (
    <>
      <style jsx>{`
        @media (min-width: 768px) {
          /* show 6 smaller cards on desktop */
          .carousel-item {
            width: 16.666667% !important;
          }
          .carousel-container {
            transform: translateX(-${currentSlide * (100 / 6)}%) !important;
          }
        }
        /* mobile and small tablet: show 2 cards */
        @media (max-width: 767px) {
          .carousel-item {
            width: 50% !important;
          }
          .carousel-container {
            transform: translateX(-${currentSlide * (100 / 2)}%) !important;
          }
        }
      `}</style>
      <div className="relative w-full py-4 sm:py-8 md:max-w-7xl md:px-10 mx-auto overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out carousel-container"
              style={{
                transform: isDesktop
                  ? `translateX(-${currentSlide * (100 / 6)}%)`
                  : `translateX(-${currentSlide * (100 / 2)}%)`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {banners.map((book, index) => (
                <div
                  key={book._id}
                  className="w-full flex-shrink-0 px-1 sm:px-5 carousel-item"
                >
                  <Link href={book.href} className="block">
                    <div className="flex flex-col items-stretch gap-2">
                      <div className="relative rounded-none overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group bg-gradient-to-b from-white to-indigo-50/20 border border-blue-50">
                        <img
                          src={book.image}
                          alt={book.alt}
                          className="rounded-none w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 brightness-105"
                          loading={index < 6 ? "eager" : "lazy"}
                        />
                      </div>

                      {/* Book info below image */}
                      <div className="text-left px-1 sm:px-2">
                        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">
                          {book.title}
                        </h3>
                        <p className="text-[12px] text-gray-500">
                          by {book.author}
                        </p>
                        <div className="mt-1 flex items-baseline justify-between">
                          <div className="text-sm font-bold text-indigo-600">
                            {book.discountPrice
                              ? `₹${book.discountPrice}`
                              : `₹${book.price}`}
                          </div>
                          {book.discountPrice && (
                            <div className="text-xs line-through text-gray-400">
                              ₹{book.price}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center mt-4 sm:mt-4 md:mt-6 space-x-2 sm:space-x-4">
            <button
              onClick={prevSlide}
              className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-blue-200 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex space-x-1 sm:space-x-2">
              {Array.from({ length: getMaxSlides() + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-indigo-500 scale-125 shadow-md"
                      : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-1.5 sm:p-2 md:p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-blue-200 hover:bg-blue-50 transition-all duration-300 hover:scale-110"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroCarousel;
