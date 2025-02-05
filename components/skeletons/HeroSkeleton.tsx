"use client";

import { motion } from "framer-motion";
import Wrapper from "@/components/shared/Wrapper";

const HeroSkeleton = () => {
  return (
    <section className="relative min-h-[40vh] lg:h-[80vh] flex items-center overflow-hidden">
      <Wrapper>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl pt-12 lg:pt-0 px-5"
        >
          {/* Skeleton Loader for Heading */}
          <div className="w-3/4 h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>

          {/* Skeleton Loader for Paragraph */}
          <div className="w-full h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
          <div className="w-2/3 h-6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-8"></div>

          {/* Skeleton Loader for Button */}
          <div className="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </motion.div>
      </Wrapper>

      {/* Skeleton Loader for Image */}
      <motion.div
        className="absolute right-[8%] 2xl:right-[20%] hidden lg:block top-1/4 transform -translate-y-1/2 w-[300px] h-[400px] bg-gray-300 dark:bg-gray-700 rounded-l-3xl shadow-2xl animate-pulse"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </section>
  );
};

export default HeroSkeleton;
