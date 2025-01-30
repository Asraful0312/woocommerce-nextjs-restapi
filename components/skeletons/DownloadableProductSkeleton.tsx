import { Skeleton } from "@/components/ui/skeleton";

export function DownloadableProductsSkeleton() {
  return (
    <div className="space-y-6 mt-14">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="bg-gray-300 w-6 h-6 rounded-md" />
            <div>
              <Skeleton className="bg-gray-300 h-6 w-40 mb-2" />
              <Skeleton className="bg-gray-300 h-4 w-32" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Skeleton className="bg-gray-300 h-10 w-full sm:w-48 rounded-md" />
            <Skeleton className="bg-gray-300 h-10 w-full sm:w-36 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
