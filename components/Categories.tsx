import Link from "next/link";
import Wrapper from "@/components/shared/Wrapper";
import api from "@/lib/woocommerce";
import { ProductCategory } from "@/lib/types";
import { buttonVariants } from "./ui/enhancedButton";
import CategoryCard from "./CategoryCard";

const getCategories = async () => {
  try {
    const { data } = await api.get("products/categories", {
      per_page: 5,
    });
    return data;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return null;
  }
};

export default async function ProductCategories() {
  const categories = await getCategories();

  if (!categories) {
    return null;
  }
  return (
    <section className="w-full py-12 bg-gray-50">
      <Wrapper className="">
        <h2 className="text-3xl font-bold text-center mb-5">
          Shop by Category
        </h2>
        <div>
          <Link
            href={`/categories`}
            className={buttonVariants({
              variant: "link",
              effect: "hoverUnderline",
            })}
          >
            View All
          </Link>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-5">
            {categories?.map((category: ProductCategory) => (
              <CategoryCard key={category?.id} category={category} />
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}
