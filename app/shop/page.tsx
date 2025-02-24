import Wrapper from "@/components/shared/Wrapper";
import ProductList from "./ProductList";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <Wrapper className="mt-14">
        <ProductList />
      </Wrapper>
    </Suspense>
  );
}
