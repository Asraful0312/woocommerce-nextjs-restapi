"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Wrapper from "./shared/Wrapper";

const HeroStatic = () => {
  return (
    <section className="relative min-h-[40vh] lg:h-[80vh] flex items-center overflow-hidden">
      <Wrapper className="">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl pt-12 lg:pt-0 px-5"
        >
          <h1 className="text-5xl font-bold mb-4">
            Discover Eco-Friendly Fashion
          </h1>
          <p className="text-xl mb-8">
            Shop our latest collection of sustainable clothing and accessories.
          </p>
          <Button size="lg">Shop Now</Button>
        </motion.div>
      </Wrapper>
      <motion.img
        src="/images.jpg"
        alt="Eco-friendly fashion"
        className="absolute right-[8%] 2xl:right-[20%] hidden lg:block top-1/4 transform -translate-y-1/2 w-[300px] h-auto object-contain rounded-l-3xl shadow-2xl"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </section>
  );
};

export default HeroStatic;
