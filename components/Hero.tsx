"use client";

import Wrapper from "./shared/Wrapper";
import { ShopConfig } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const defaultSlider = [
  { image: "/h1.png", endpoint: "" },
  { image: "/h2.png", endpoint: "" },
];

const fetchProducts = async (): Promise<ShopConfig> => {
  const res = await fetch(`/api/slider`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data;
};

const Hero = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["heroProducts"],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  let slider;

  if (isLoading) {
    return (
      <Wrapper className="mt-5">
        <Skeleton className="w-full h-[50vh] bg-gray-300" />
      </Wrapper>
    );
  } else if (!isLoading && error) {
    slider = defaultSlider;
  } else if (!isLoading && !error && data && data?.slider.length === 0) {
    slider = defaultSlider;
  } else if (!isLoading && !error && data && data?.slider?.length > 0) {
    slider = data?.slider;
  }

  return (
    <Wrapper className="mt-5">
      <Carousel
        plugins={[
          Autoplay({
            delay: 3000, // 3 seconds delay
            stopOnInteraction: true,
          }),
        ]}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {slider?.map((item, index) => (
            <CarouselItem key={index} className="pl-0 max-h-[60vh]">
              <Link href={`${item?.endpoint}`} className="h-full">
                <Image
                  src={item?.image}
                  className="w-full h-full object-cover"
                  width={1140}
                  height={700}
                  alt="slider image"
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Wrapper>
  );
};

export default Hero;
