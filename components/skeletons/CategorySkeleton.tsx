import { Skeleton } from "../ui/skeleton";
import Wrapper from "@/components/shared/Wrapper"

const CategorySkeleton = () => {
  return (
    <Wrapper className="mt-5">
      <Skeleton className="bg-gray-300 h-6 w-32 mb-3" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-full h-[150px] bg-gray-300" />
        ))}
      </div>
    </Wrapper>
  );
};

export default CategorySkeleton;
