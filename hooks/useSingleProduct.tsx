import { useQuery } from "@tanstack/react-query";
import { ProductType } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";

const fetchSingleProduct = async (slug: string): Promise<ProductType> => {
  const res = await fetch(`${BASE_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const useSingleProduct = (slug?: string) => {
  return useQuery<ProductType>({
    queryKey: ["product", slug],
    queryFn: () => fetchSingleProduct(slug!),
    enabled: !!slug, // Only fetch when slug is available
  });
};
