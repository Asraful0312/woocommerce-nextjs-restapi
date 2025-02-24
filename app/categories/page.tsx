import React, { Suspense } from "react";
import CategoriesContent from "./CategoriesContent";

const CategoryPage = () => {
  return (
    <Suspense fallback="<div>Loading...</div>">
      <CategoriesContent />
    </Suspense>
  );
};

export default CategoryPage;
