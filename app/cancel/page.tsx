import React, { Suspense } from "react";
import CancelContent from "./CancelContent";

const Cancel = () => {
  return (
    <Suspense fallback="<div>Loading...</div>">
      <CancelContent />
    </Suspense>
  );
};

export default Cancel;
