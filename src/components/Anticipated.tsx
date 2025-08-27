"use client";

import { useState, useEffect } from "react";
import BookCard from "./BookCard";
import { useCart } from "../contexts/CartContext";

const books = [
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

interface CategoryShowcaseItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount?: number;
  isActive: boolean;
  sortOrder: number;
}

const Anticipated = () => {
  const [categories, setCategories] = useState<CategoryShowcaseItem[]>([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   // Show default categories immediately
  //   setCategories([]);
  //   setLoading(false);

  //   // Fetch from API in background
  //   fetchCategories();
  // }, []);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await fetch("/api/category-showcases", {
  //       cache: "no-cache",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data.success && data.data.length > 0) {
  //         setCategories(data.data);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching category showcases:", error);
  //     // Keep default categories on error
  //   }
  // };

  const formatCategoriesForCard = (category: CategoryShowcaseItem) => ({
    id: category._id,
    name: category.name,
    image: category.image,
    href: `/${category.slug}`,
    description: category.description,
    ...(category.productCount && { productCount: category.productCount }),
  });

  // cart actions
  const { addToCart } = useCart();

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white ">
        <div className="container mx-auto px-2 md:px-6 lg:px-8">
          <div className="text-center sm:text-left mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-4"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto justify-items-center">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="w-full">
                <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse mb-3"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto  bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-2 md:px-6 lg:px-8">
        {/* Best Sellers Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="md:text-3xl text-xl font-bold text-gray-900">
                Most Anticipated Books
              </h3>
              <p className="md:text-md text-sm text-gray-500">
                Top picks — updated just for you
              </p>
            </div>
            <div className="text-sm text-indigo-600 font-medium">View all</div>
          </div>

          {/* sample books data - replace with real API later */}
          <div className="flex shrink-1 overflow-x-auto gap-4 md:gap-12 pb-4">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book as any}
                onAdd={(id) => {
                  // use minimal product shape expected by CartContext
                  addToCart({
                    _id: id,
                    name: book.title,
                    slug: book.title,
                    imageUrls: [book.image],
                    price: book.price,
                    discountedPrice: book.discountPrice,
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Anticipated;
