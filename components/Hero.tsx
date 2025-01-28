"use client";
import React from "react";
import Wrapper from "./shared/Wrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HeroImg1 from "../app/assets/images/h1.png";
import HeroImg2 from "../app/assets/images/h2.png";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

const IMAGES = [HeroImg1, HeroImg2];

const Hero = () => {
  return (
    <Wrapper className="">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{ loop: true }}
        className="w-full"
      >
        <CarouselContent>
          {IMAGES.map((img, index) => (
            <CarouselItem className="pl-0" key={index}>
              <Image
                className="w-full object-cover"
                src={img}
                alt="hero image"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </Wrapper>
  );
};

export default Hero;
