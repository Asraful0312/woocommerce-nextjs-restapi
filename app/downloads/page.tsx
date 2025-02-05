"use client";

import AuthGuard from "@/components/AuthGuard";
import DownloadableProducts from "@/components/DownloadableProducts";
import { DownloadableProductType } from "@/lib/types";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import Wrapper from "@/components/shared/Wrapper";
import { DownloadableProductsSkeleton } from "@/components/skeletons/DownloadableProductSkeleton";

const fetchDownloads = async (
  userId: string
): Promise<DownloadableProductType[] | null> => {
  if (!userId) return null; // Prevent fetching if userId is not available
  const response = await fetch(`/api/downloads/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch downloads");
  }
  return response.json();
};

const Downloads = () => {
  const { userId } = useAuthStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["downloads", userId],
    queryFn: () => fetchDownloads(userId!),
    enabled: !!userId, // Only run query if userId exists
  });

  if (isLoading)
    return (
      <Wrapper>
        <DownloadableProductsSkeleton />
      </Wrapper>
    );
  if (isError) return <AuthGuard>Error loading downloads</AuthGuard>;
  if (!isLoading && !isError && data && data?.length === 0)
    return (
      <AuthGuard>
        <p className="text-center pt-12">
          You haven&rsquo;t downloaded any products yet
        </p>
      </AuthGuard>
    );

  return (
    <AuthGuard>
      <Wrapper className="mt-10">
        <h1 className="mb-3 font-semibold">Your Downloads</h1>
        {data && data?.length > 0 && <DownloadableProducts products={data} />}
      </Wrapper>
    </AuthGuard>
  );
};

export default Downloads;
