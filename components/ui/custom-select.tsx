import { cn } from "@/lib/utils";
import React, { useState, useRef, useEffect } from "react";
import CaretUpIcon from "../icons/CaretUpIcon";

type CustomSelectProps = {
  options: string[];
  defaultValue: string;
  className?: string;
  color?: string;
  parentClassName?: string;
  onSelect?: (value: string) => void;
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  defaultValue,
  onSelect,
  className,
  parentClassName,
  color,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={selectRef}
      className={cn("relative inline-block text-left", parentClassName)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-4 py-2 border border-primary rounded-full text-primary flex items-center justify-between space-x-2 text-base focus:border-blue-600",
          className
        )}
      >
        <span className={cn("text-base text-primary", color)}>
          {selectedOption}
        </span>
        <CaretUpIcon
          className={`w-4 h-4 transition-transform transform ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full bg-white border border-primary rounded-lg text-base shadow-lg z-10 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
