import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  text: string;
  className?: string;
};

const Heading = ({ text, className }: Props) => {
  return (
    <h2 className={cn("font-bold text-center text-2xl md:text-3xl mb-4", className)}>
      {text}
    </h2>
  );
};

export default Heading;
