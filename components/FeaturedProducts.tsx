import Wrapper from "./shared/Wrapper";
import Heading from "./shared/Heading";
import ProductCard from "./shared/ProductCard";
import { ProductType } from "@/lib/types";
import Link from "next/link";
import { buttonVariants } from "./ui/enhancedButton";
import ErrorMessage from "./shared/ErrorMessage";
import { BASE_URL } from "@/lib/utils";

const getFeatureProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products?feature=true&per_page=8`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch products");
    const { products } = await res.json();
    return products;
  } catch (error) {
    console.log("feature product error", error);
    return null;
  }
};

const FeaturedProducts = async () => {
  const products = await getFeatureProducts();

  if (!products)
    return <ErrorMessage className="text-black" message="No products found" />;

  return (
    <Wrapper className="">
      <Heading text="Featured Products" />
      <Link
        href={`/shop?feature=true`}
        className={buttonVariants({
          variant: "link",
          effect: "hoverUnderline",
        })}
      >
        View All
      </Link>

      {/* render product */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products?.map((product: ProductType) => (
          <div key={product?.id + product?.slug}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </Wrapper>
  );
};

export default FeaturedProducts;
