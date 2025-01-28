import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import RecentProducts from "@/components/RecentProducts";
import React from "react";

const Page = () => {
  return (
    <div className="space-y-14">
      <Hero />
      <FeaturedProducts />
      <RecentProducts />
    </div>
  );
};

export default Page;
