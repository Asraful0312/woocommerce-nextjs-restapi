import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/lib/types";

const fetchUser = async (userId: string, token: string): Promise<UserType> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // Use the JWT token from login
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const useUser = (userId: string, token: string) => {
  return useQuery<UserType>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!, token),
    enabled: !!userId, // Only fetch when slug is available
  });
};
