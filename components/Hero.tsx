"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Wrapper from "./shared/Wrapper";
import { ProductType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import HeroStatic from "./HeroStatic";
import Link from "next/link";
import { buttonVariants } from "./ui/enhancedButton";
import HeroSkeleton from "./skeletons/HeroSkeleton";
import { sanitize } from "@/lib/utils";

const fetchProducts = async (): Promise<ProductType[]> => {
  const res = await fetch(`/api/products?feature=true&per_page=3&recent=true`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const { products } = await res.json();
  return products;
};

const Hero = () => {
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["heroProducts"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (products) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [products, currentIndex]);

  if (isLoading) {
    return <HeroSkeleton />;
  }

  // Handle swipe navigation
  const handleDragEnd = (event: MouseEvent | TouchEvent, info: any) => {
    if (!products) return;

    const swipeThreshold = 100; // Minimum swipe distance to trigger change
    if (info.offset.x < -swipeThreshold) {
      // Swipe left (next slide)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    } else if (info.offset.x > swipeThreshold) {
      // Swipe right (previous slide)
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <>
      {error ? (
        <HeroStatic />
      ) : !products ? (
        <HeroStatic />
      ) : !error && products && products?.length <= 1 ? (
        <HeroStatic />
      ) : (
        <section className="relative min-h-[40vh] lg:h-[80vh] flex items-center overflow-hidden">
          <div className="absolute size-44 rounded-full blur-2xl opacity-30 -top-20 bg-primary left-0" />
          <Wrapper className="relative">
            <AnimatePresence initial={false} mode="wait">
              {!isLoading && products && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="max-w-2xl pt-12 lg:pt-0 px-5"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                >
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {products[currentIndex].name.substring(0, 30)}
                  </h1>
                  {products[currentIndex].short_description ? (
                    <p
                      className="text-lg md:text-xl mb-8"
                      dangerouslySetInnerHTML={{
                        __html: sanitize(
                          products[currentIndex].short_description.length > 80
                            ? `${products[
                                currentIndex
                              ].short_description.substring(0, 80)}...`
                            : products[currentIndex].short_description
                        ),
                      }}
                    />
                  ) : (
                    <p className="text-lg md:text-xl mb-8">
                      Discover our eco-friendly and sustainable fashion
                      collection.
                    </p>
                  )}
                  <Link
                    href={`/product/${products[currentIndex]?.slug}`}
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Shop Now
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </Wrapper>

          <AnimatePresence initial={false} mode="wait">
            {!isLoading && products && (
              <motion.img
                key={currentIndex}
                src={products[currentIndex].images[0].src || "/images.jpg"}
                alt={products[currentIndex].name}
                className="absolute right-[8%] 2xl:right-[20%] hidden lg:block top-1/4 transform -translate-y-1/2 w-[300px] h-auto object-contain rounded-l-3xl shadow-2xl"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
              />
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {products?.map((_, index) => (
              <button
                key={index}
                className={`w-5 h-[4px] transition-colors duration-500 rounded-lg ease-in  ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Hero;
