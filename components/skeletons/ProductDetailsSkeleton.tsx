import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/shared/Wrapper";

const ProductDetailsSkeleton = () => {
  return (
    <Wrapper className="mt-14">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image Skeleton */}
        <div className="w-full h-[400px] md:basis-[40%] border rounded-md">
          <Skeleton className="bg-gray-300 w-full h-full" />
        </div>

        {/* Product Info Skeleton */}
        <div className="w-full md:basis-[60%] space-y-4">
          <Skeleton className="bg-gray-300 h-8 w-3/4" /> {/* Product Name */}
          <Skeleton className="bg-gray-300 h-6 w-1/3" /> {/* Price */}
          <Skeleton className="bg-gray-300 h-20 w-full" /> {/* Short Description */}

          <div className="space-y-2">
            <Skeleton className="bg-gray-300 h-6 w-1/4" /> {/* Weight Label */}
            <Skeleton className="bg-gray-300 h-6 w-1/4" /> {/* SKU Label */}
          </div>

          <div className="space-y-2">
            <Skeleton className="bg-gray-300 h-6 w-1/4" /> {/* Stock Label */}
            <Skeleton className="bg-gray-300 h-6 w-1/4" /> {/* Stock Value */}
          </div>

          <Skeleton className="bg-gray-300 h-12 w-32" /> {/* Buy Now Button */}
        </div>
      </div>
    </Wrapper>
  );
};

export default ProductDetailsSkeleton;
