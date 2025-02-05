import { Skeleton } from "../ui/skeleton";

const OrderRowSkeleton = () => {
  return (
    <div className="w-full space-y-3">
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
      <Skeleton className="w-full h-8 rounded-md bg-gray-300" />
    </div>
  );
};

export default OrderRowSkeleton;
