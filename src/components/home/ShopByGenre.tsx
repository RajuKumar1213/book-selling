"use client";

import React from "react";
import Link from "next/link";

interface Genre {
  id: string;
  name: string;
  image: string;
  description: string;
  href: string;
}

const ShopByGenre = () => {
  // Dummy data for genres
  const genres: Genre[] = [
    {
      id: "romance-comedy",
      name: "Romance And Comedy",
      image:
        "https://www.crossword.in/cdn/shop/files/Romance_Erotica_a6769e9a-d31d-4395-b002-3746395b171c.png?v=1745233653&width=520",
      description: "Imaginative stories and narratives",
      href: "/genre/fiction",
    },
    {
      id: "non-fiction",
      name: "Self Help & Wellness",
      image:
        "https://www.crossword.in/cdn/shop/files/Self-Help_Wellness_ee9d0576-1d35-42f1-8fff-2b3964ce2385.png?v=1745321525&width=520",
      description: "Real events, facts, and biographies",
      href: "/genre/non-fiction",
    },
    {
      id: "mystery",
      name: "Business & Finance",
      image:
        "https://www.crossword.in/cdn/shop/files/Business_Finance_629d8524-4b42-4848-a390-0328ee1e340b.png?v=1745233901&width=520",
      description: "Thrilling detective stories",
      href: "/genre/mystery",
    },
    {
      id: "romance",
      name: "Mystry & Thriller",
      image:
        "https://www.crossword.in/cdn/shop/files/Mystery_Thriller_e47f6e38-0cd5-42d6-ba20-6276be9c3f1d.png?v=1745234056&width=520",
      description: "Love stories and relationships",
      href: "/genre/romance",
    },
    {
      id: "sci-fi",
      name: "Historical Fiction & Mythology",
      image:
        "https://www.crossword.in/cdn/shop/files/Historical_Fiction_Mythology_2eb77519-2c28-4ff6-9944-4e072580cada.png?v=1745234152&width=520",
      description: "Futuristic worlds and technology",
      href: "/genre/sci-fi",
    },
    {
      id: "fantasy",
      name: "Literature and Fiction",
      image:
        "https://www.crossword.in/cdn/shop/files/Literature_Fiction.png?v=1745321606&width=520",
      description: "Magical realms and adventures",
      href: "/genre/fantasy",
    },
    {
      id: "biography",
      name: "Mega Comic",
      image:
        "https://www.crossword.in/cdn/shop/files/Manga_Comics_9b8e4b69-a1f1-4215-8ee6-a332f36351d2.png?v=1745234333&width=520",
      description: "Life stories of remarkable people",
      href: "/genre/biography",
    },
    {
      id: "history",
      name: "Biography & Memoir",
      image:
        "https://www.crossword.in/cdn/shop/files/Biography_Memoir_de3dc1f0-22c2-4e61-aa26-cd4f65c886ea.png?v=1745234246&width=520",
      description: "Past events and civilizations",
      href: "/genre/history",
    },
    {
      id: "history",
      name: "Occult & Paranormal",
      image:
        "https://www.crossword.in/cdn/shop/files/Occult_Paranomol-10.png?v=1745324273&width=520",
      description: "Past events and civilizations",
      href: "/genre/history",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-left mb-12">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
            Shop By <span className="text-indigo-600">Genre</span>
          </h2>
          <p className="text-md text-left text-gray-600 max-w-2xl">
            Discover your next favorite book from our curated collection of
            genres
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 md:gap-x-16 gap-y-1 gap-4 ">
          {genres.map((genre) => (
            <Link key={genre.id} href={genre.href} className="group">
              <div className="relative ">
                <div className=" overflow-hidden bg-pink-100 rounded-2xl flex items-center justify-center">
                  <img
                    src={genre.image}
                    alt={genre.name}
                    className="w-[160px] h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  />
                </div>

                <div className="p-4 text-center">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {genre.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {genre.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <Link
            href="/genres"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            View All Genres
            <svg
              className="ml-2 w-4 h-4"
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
        </div> */}
      </div>
    </section>
  );
};

export default ShopByGenre;
