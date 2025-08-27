"use client";

import Link from "next/link";
import React from "react";

interface BookCardProps {
  book: {
    _id: string;
    image: string;
    alt?: string;
    href?: string;
    title: string;
    author: string;
    price: number;
    discountPrice?: number | null;
  };
  onAdd?: (bookId: string) => void;
}

export default function BookCard({ book, onAdd }: BookCardProps) {
  return (
    <div className="w-full  min-w-[150px] group">
      <div className="bg-white rounded-nine transition-shadow duration-200  flex flex-col h-full">
        <Link href={book.href || "#"} className="block">
          <div className="relative w-full overflow-hidden">
            <img
              src={book.image}
              alt={book.alt || book.title}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500 rounded-none"
            />
          </div>
        </Link>

        <div className="mt-2 flex-1 flex flex-col items-center">
          <Link href={book.href || "#"} className="block">
            <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-1 text-center">
              {book.title}
            </h3>
            <p className="text-[12px] text-gray-500 mt-1 line-clamp-1 text-center">
              {" "}
              {book.author}
            </p>
          </Link>

          <div className="my-1 flex items-center justify-between">
            <div className="text-sm font-bold text-indigo-600">
              {book.discountPrice ? `₹${book.discountPrice}` : `₹${book.price}`}
            </div>
            {book.discountPrice && (
              <div className="text-xs mx-2 line-through text-gray-400">
                ₹{book.price}
              </div>
            )}
            {book.discountPrice && (
              <div className="text-xs  text-green-500 ">
                {((book.price / book.discountPrice) * 100 - 100).toFixed(0)}%
              </div>
            )}
          </div>
          <button
            onClick={() => onAdd && onAdd(book._id)}
            className="ml-4 inline-flex items-center mb-2 px-3 py-1.5 border border-purple-500 text-black cursor-pointer text-xs font-medium rounded-md shadow-sm transition-colors"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}
