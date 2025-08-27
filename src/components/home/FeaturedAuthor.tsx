"use client";

import React from "react";
import Link from "next/link";

interface Author {
  id: string;
  name: string;
  image: string;
  bio: string;
  href: string;
  booksCount: number;
}

const FeaturedAuthor = () => {
  const authors: Author[] = [
    {
      id: "author-1",
      name: "J.K. Rowling",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/220px-J._K._Rowling_2010.jpg",
      bio: "Harry Potter series author",
      href: "/authors/jk-rowling",
      booksCount: 15,
    },
    {
      id: "author-2",
      name: "Stephen King",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Stephen_King%2C_Comicon.jpg/220px-Stephen_King%2C_Comicon.jpg",
      bio: "Master of horror fiction",
      href: "/authors/stephen-king",
      booksCount: 70,
    },
    {
      id: "author-3",
      name: "Agatha Christie",
      image:
        "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQcCGKL16ixcUHi8TY3muCijEr5WcdnBtoKPbg1bmzT4-p_gxp_ODQck89n9PEAUtYbGd0gPU9tt4RM5q0",
      bio: "Queen of mystery novels",
      href: "/authors/agatha-christie",
      booksCount: 85,
    },
    {
      id: "author-4",
      name: "George R.R. Martin",
      image:
        "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcT1MMHio5Za3P8MFiMMz6swyOXMOqGgRdoLS7x2CdxnILlH9A5hc5JRY3pJXHNAbHDIQfPAZDgaYZb7ZU8",
      bio: "A Song of Ice and Fire author",
      href: "/authors/george-rr-martin",
      booksCount: 12,
    },
    {
      id: "author-5",
      name: "Haruki Murakami",
      image:
        "https://cdn.britannica.com/20/195620-050-9379EDA9/Murakami-Haruki-2012.jpg",
      bio: "Magical realism master",
      href: "/authors/haruki-murakami",
      booksCount: 25,
    },
    {
      id: "author-6",
      name: "Margaret Atwood",
      image:
        "https://cdn.britannica.com/88/207888-050-9B3C1774/Margaret-Atwood-2018.jpg",
      bio: "The Handmaid's Tale author",
      href: "/authors/margaret-atwood",
      booksCount: 18,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-left mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Featured <span className="text-indigo-600">Authors</span>
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl ">
            Meet the talented writers behind your favorite stories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {authors.map((author, index) => (
            <Link
              key={author.id}
              href={author.href}
              className="group flex flex-col items-center text-center hover:scale-105 transition-all duration-300"
            >
              <div className="relative mb-4">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white group-hover:border-indigo-200 transition-all duration-300 group-hover:scale-110">
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {author.name}
                </h3>
                <p className="text-xs text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                  {author.bio}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/authors"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300 group"
          >
            View All Authors
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
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
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuthor;
