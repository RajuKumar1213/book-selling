"use client";
import {
  Header,
  HeroCarousel,
  CategoryShowcase,
  Footer,
  BestSeller,
  CelebratedLovedDay,
  SpeciallyTendingCakes,
  WhatsAppButton,
} from "@/components";
import Anticipated from "@/components/Anticipated";
import CategorySection from "@/components/CategorySection";
import FeaturedAuthor from "@/components/home/FeaturedAuthor";
import ShopByAge from "@/components/home/ShopByAge";
import ShopByGenre from "@/components/home/ShopByGenre";
import { useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  imageUrls: string[];
  price: number;
  discountedPrice: number;
  finalPrice: number;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  isBestseller: boolean;
  isFeatured: boolean;
  discountPercentage: number;
  categories: Array<{
    name: string;
    slug: string;
  }>;
}

// Hardcoded products data for faster loading

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header />

      {/* Hero Carousel */}
      <div className="relative">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20 pointer-events-none"></div>
      </div>

      {/* Featured Categories Showcase */}
      <CategoryShowcase />

      {/* Anticipated  */}

      <Anticipated />

      {/* Shop by Genre */}
      <ShopByGenre />

      <ShopByAge />

      {/* Featured Authors */}
      <FeaturedAuthor />

      <WhatsAppButton />
      <Footer />
    </main>
  );
}
