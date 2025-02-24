import Wrapper from "./shared/Wrapper";
import Heading from "./shared/Heading";
import ProductCard from "./shared/ProductCard";
import { ProductType } from "@/lib/types";
import Link from "next/link";
import { buttonVariants } from "./ui/enhancedButton";
import api from "@/lib/woocommerce";
import NoProducts from "./shared/no-products";

const getRecentProducts = async () => {
  try {
    const { data: products } = await api.get("products", {
      per_page: 8,
      orderby: "date",
      order: "desc",
      status: "publish",
    });

    // Fetch variations if the product type is "variable"
    const productsWithVariations = await Promise.all(
      products.map(async (product: ProductType) => {
        if (product.type === "variable") {
          const { data: variations } = await api.get(
            `products/${product.id}/variations`
          );
          return { ...product, variations };
        }
        return product;
      })
    );

    return productsWithVariations;
  } catch (error) {
    console.error("Error fetching recent products:", error);
    return null;
  }
};

const FeaturedProducts = async () => {
  const products = await getRecentProducts();

  if (!products)
    return (
      <Wrapper>
        <Heading text="Recent Products" />
        <NoProducts />
      </Wrapper>
    );

  return (
    <Wrapper className="">
      <Heading text="Recent Products" />
      {products && products.length > 0 && (
        <Link
          href={`/shop?recent=true`}
          className={buttonVariants({
            variant: "link",
            effect: "hoverUnderline",
          })}
        >
          View All
        </Link>
      )}

      {products && products.length === 0 && <NoProducts />}

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
