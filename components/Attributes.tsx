"use client";
import { useAttributeStore } from "@/stores/useAttributesStore";
import { Button } from "./ui/button";
import { AttributesType } from "@/lib/types";

const AttributeSelector = ({
  attributes,
}: {
  attributes: AttributesType[];
}) => {
  const { selectedAttributes, setAttribute } = useAttributeStore();

  return (
    <div className="mt-4">
      {attributes?.length > 0 &&
        attributes.map((attribute) => (
          <div className="" key={`${attribute.id}`}>
            <h2 className="leading-6 font-semibold mt-4">{attribute.name}</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {attribute.options.map((option) => (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setAttribute(attribute.name, option);
                  }}
                  variant={
                    selectedAttributes[attribute.name] === option
                      ? "default"
                      : "outline"
                  }
                  key={`${attribute.name}-${option}`} // Ensure unique keys
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AttributeSelector;
