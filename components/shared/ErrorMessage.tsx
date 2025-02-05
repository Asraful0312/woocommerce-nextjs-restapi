import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  message: string;
  className?: string;
};

const ErrorMessage = ({ message, className }: Props) => {
  return (
    <div className="my-12 flex items-center justify-center">
      <p className={cn("text-center text-red-500", className)}>{message}</p>
    </div>
  );
};

export default ErrorMessage;
