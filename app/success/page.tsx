import React, { Suspense } from "react";
import SuccessContent from "./SuccessContent";

const page = () => {
  return (
    <Suspense fallback={"<div>Loading...</div>"}>
      <SuccessContent />
    </Suspense>
  );
};

export default page;
