import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const Wrapper = ({ className, children }: Props) => {
  return (
    <div
      className={cn("w-full max-w-[1140px] px-5 lg:px-0 mx-auto", className)}
    >
      {children}
    </div>
  );
};

export default Wrapper;
