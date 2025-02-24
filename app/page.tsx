import ProductCategories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletters";
import RecentProducts from "@/components/RecentProducts";
import React from "react";

const Page = () => {
  return (
    <div className="space-y-14">
      <Hero />
      <ProductCategories />
      <FeaturedProducts />
      <RecentProducts />
      {/* <Testimonials /> */}
      <Newsletter />
    </div>
  );
};

export default Page;
