"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface AgeGroup {
  id: string;
  name: string;
  ageRange: string;
  icon: string;
  href: string;
  color: string;
}

const ShopByAge = () => {
  const ageGroups: AgeGroup[] = [
    {
      id: "0-2",
      name: "Babies & Toddlers",
      ageRange: "0-2",
      icon: "/icons/baby-boy.png",
      href: "/age/0-2",
      color: "text-pink-500",
    },
    {
      id: "3-5",
      name: "Preschool",
      ageRange: "3-5",
      icon: "/icons/boy.png",
      href: "/age/3-5",
      color: "text-yellow-500",
    },
    {
      id: "6-8",
      name: "Early Elementary",
      ageRange: "6-8",
      icon: "/icons/student.png",
      href: "/age/6-8",
      color: "text-green-500",
    },
    {
      id: "9-12",
      name: "Pre-Teen",
      ageRange: "9-12",
      icon: "/icons/teenage.png",
      href: "/age/9-12",
      color: "text-blue-500",
    },
    {
      id: "teen",
      name: "Teen",
      ageRange: "Teen",
      icon: "/icons/teen.png",
      href: "/age/teen",
      color: "text-purple-500",
    },
    {
      id: "young-adult",
      name: "Young Adult",
      ageRange: "Young Adult",
      icon: "/icons/strong.png",
      href: "/age/young-adult",
      color: "text-indigo-500",
    },
    {
      id: "old-man",
      name: "Old Man",
      ageRange: "Old Man",
      icon: "/icons/tax-inspector.png",
      href: "/age/old-man",
      color: "text-indigo-500",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="text-left mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            Shop By <span className="text-indigo-600">Age</span>
          </h2>
          <p className="text-sm  text-gray-600">
            Find the perfect books for every age group
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 md:gap-4">
          {ageGroups.map((ageGroup) => (
            <Link
              key={ageGroup.id}
              href={ageGroup.href}
              className="group flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div
                className={`mb-4 ${ageGroup.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <Image
                  src={ageGroup.icon}
                  alt={ageGroup.name}
                  width={80}
                  height={80}
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {ageGroup.ageRange}
                </div>
                <div className="text-xs text-gray-500 group-hover:text-indigo-500 transition-colors">
                  {ageGroup.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <Link
            href="/ages"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
          >
            View All Age Groups
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

export default ShopByAge;
