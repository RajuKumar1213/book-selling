import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookNavigation() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const categoriesLoading = false;

  const groupedCategories = {
    Fiction: [
      { _id: "f1", name: "Romance", slug: "romance-fiction", type: "Popular" },
      {
        _id: "f2",
        name: "Mystery & Thriller",
        slug: "mystery-fiction",
        type: "Popular",
      },
      { _id: "f3", name: "Science Fiction", slug: "sci-fi", type: "Trending" },
      { _id: "f4", name: "Fantasy", slug: "fantasy", type: "Trending" },
      {
        _id: "f5",
        name: "Historical Fiction",
        slug: "historical-fiction",
        type: "Popular",
      },
      {
        _id: "f6",
        name: "Literary Fiction",
        slug: "literary-fiction",
        type: "Trending",
      },
    ],
    "Non-Fiction": [
      {
        _id: "nf1",
        name: "Biographies & Memoirs",
        slug: "biographies",
        type: "Popular",
      },
      { _id: "nf2", name: "History", slug: "history", type: "Popular" },
      {
        _id: "nf3",
        name: "Science & Technology",
        slug: "science",
        type: "Trending",
      },
      {
        _id: "nf4",
        name: "Business & Economics",
        slug: "business",
        type: "Trending",
      },
      {
        _id: "nf5",
        name: "Self-Help & Personal Development",
        slug: "self-help",
        type: "Popular",
      },
      { _id: "nf6", name: "Travel", slug: "travel", type: "Trending" },
      {
        _id: "nf7",
        name: "Health & Wellness",
        slug: "health",
        type: "Popular",
      },
    ],
    Classics: [
      { _id: "cl1", name: "Timeless Classics", slug: "classics", type: null },
      {
        _id: "cl2",
        name: "American Literature",
        slug: "american-classics",
        type: null,
      },
      {
        _id: "cl3",
        name: "British Literature",
        slug: "british-classics",
        type: null,
      },
      {
        _id: "cl4",
        name: "World Classics",
        slug: "world-classics",
        type: null,
      },
    ],
    "Children's Books": [
      { _id: "cb1", name: "Picture Books", slug: "picture-books", type: null },
      { _id: "cb2", name: "Chapter Books", slug: "chapter-books", type: null },
      { _id: "cb3", name: "Young Adult", slug: "young-adult", type: null },
      { _id: "cb4", name: "Middle Grade", slug: "middle-grade", type: null },
    ],
    Philosophy: [
      {
        _id: "ph1",
        name: "Eastern Philosophy",
        slug: "eastern-philosophy",
        type: null,
      },
      {
        _id: "ph2",
        name: "Western Philosophy",
        slug: "western-philosophy",
        type: null,
      },
      { _id: "ph3", name: "Ethics & Morality", slug: "ethics", type: null },
    ],
    Poetry: [
      {
        _id: "po1",
        name: "Contemporary Poetry",
        slug: "contemporary-poetry",
        type: null,
      },
      {
        _id: "po2",
        name: "Classic Poetry",
        slug: "classic-poetry",
        type: null,
      },
    ],
    "Spiritual & Religious": [
      { _id: "sr1", name: "Buddhism", slug: "buddhism", type: null },
      { _id: "sr2", name: "Christianity", slug: "christianity", type: null },
      { _id: "sr3", name: "Inspirational", slug: "inspirational", type: null },
      { _id: "sr4", name: "New Age", slug: "new-age", type: null },
    ],
    "Cookbooks & Food": [
      { _id: "cf1", name: "Baking", slug: "baking", type: null },
      {
        _id: "cf2",
        name: "International Cuisine",
        slug: "international-cuisine",
        type: null,
      },
      {
        _id: "cf3",
        name: "Healthy Eating",
        slug: "healthy-eating",
        type: null,
      },
    ],
    "Art & Photography": [
      { _id: "ap1", name: "Art History", slug: "art-history", type: null },
      { _id: "ap2", name: "Photography", slug: "photography", type: null },
    ],
  };

  const handleDropdown = (group: string) => {
    if (groupedCategories[group as keyof typeof groupedCategories]?.length > 1) {
      setIsDropdownOpen(group.toLowerCase());
    }
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(null);
  };

  const handleCategoryClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/category/${slug}`);
    setIsDropdownOpen(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm mt-21 relative z-40 border-t border-blue-100 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      ref={dropdownRef}
      style={{ position: "sticky", top: 0 }}
    >
      <div className="container mx-auto px-2 flex items-center justify-center relative">
        <div className="flex items-center justify-start flex-wrap space-x-4 py-2 nav-scroll-container">
          {Object.keys(groupedCategories).map((group) => {
            const categoriesByType = groupedCategories[group as keyof typeof groupedCategories].reduce(
              (acc: any, category) => {
                const type = category.type || 'Other';
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
                  handleDropdown(group);
                }}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex text-sm font-extrabold items-center space-x-1 hover:text-blue-600 whitespace-nowrap px-2 py-[6px] transition-colors duration-200 group"
                  onClick={(e) => {
                    if (groupedCategories[group as keyof typeof groupedCategories].length === 1) {
                      handleCategoryClick(groupedCategories[group as keyof typeof groupedCategories][0].slug, e);
                    }
                  }}
                >
                  <span className="group-hover:text-blue-600 transition-colors">
                    {group}
                  </span>
                </button>

                {isDropdownOpen === group.toLowerCase() &&
                  groupedCategories[group as keyof typeof groupedCategories].length > 1 && (
                    <div
                      className="absolute top-full -left-1 bg-white backdrop-blur-lg shadow-xl rounded-none border border-blue-100 overflow-hidden"
                      style={{
                        boxShadow:
                          "0 20px 40px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)",
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
                                      ? "bg-gradient-to-br from-blue-50 to-indigo-50"
                                      : "bg-white"
                                  }`}
                                >
                                  <div className="p-4">
                                    <h3 className="text-sm font-bold text-blue-600 mb-2 border-b border-blue-200 pb-2 whitespace-nowrap">
                                      {type}
                                    </h3>
                                    <div className="">
                                      {typeCategories.map((category: any) => (
                                        <button
                                          key={category._id}
                                          onClick={(e) =>
                                            handleCategoryClick(
                                              category.slug,
                                              e
                                            )
                                          }
                                          className="flex text-left py-2 px-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:text-blue-700 rounded-none transition-all duration-300 font-medium whitespace-nowrap line-clamp-1 w-full hover:shadow-sm transform hover:scale-105"
                                        >
                                          {category.name}
                                        </button>
                                      ))}
                                      <div className="flex-grow" />
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="p-3 flex flex-col">
                            {groupedCategories[group as keyof typeof groupedCategories].map((category) => (
                              <button
                                key={category._id}
                                onClick={(e) =>
                                  handleCategoryClick(category.slug, e)
                                }
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 hover:text-blue-700 rounded-none transition-all duration-300 font-medium whitespace-nowrap transform hover:scale-105 hover:shadow-sm"
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-blue-50/50 to-transparent pointer-events-none z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-indigo-50/50 to-transparent pointer-events-none z-10"></div>
      </div>
    </nav>
  );
}
