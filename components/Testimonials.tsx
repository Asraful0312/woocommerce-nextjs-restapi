"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Wrapper from "./shared/Wrapper";

const testimonials = [
  {
    name: "Alice Johnson",
    text: "I love the quality and sustainability of EcoShop products!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Bob Smith",
    text: "Great customer service and fast shipping. Highly recommend!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Carol Davis",
    text: "The eco-friendly packaging is a game-changer. Keep it up!",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-muted">
      <Wrapper className="">
        <h2 className="text-3xl font-bold mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                  </div>
                  <p className="text-muted-foreground">{testimonial.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default Testimonials;
