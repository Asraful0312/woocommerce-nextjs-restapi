const ProductCardSkeleton = () => {
  return (
    <div className="w-full rounded overflow-hidden h-full flex flex-col justify-between animate-pulse ">
      <div>
        {/* Image Skeleton */}
        <div className="w-full h-[200px] mx-auto bg-gray-300 rounded-md"></div>

        {/* Product Details Skeleton */}
        <div className="p-3">
          <div className="h-5 bg-gray-300 rounded w-3/4 mx-auto"></div>

          {/* Price Skeleton */}
          <div className="flex justify-center gap-2 mt-2">
            <div className="h-4 bg-gray-300 rounded w-10"></div>
            <div className="h-4 bg-gray-300 rounded w-12"></div>
          </div>

          {/* Variations Skeleton */}
          <div className="h-4 bg-gray-300 rounded w-20 mx-auto mt-2"></div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className=" pb-3">
        <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
