import React, { Suspense } from "react";
import FailContent from "./FailContent";

const Fail = () => {
  return (
    <Suspense fallback={"<div>Loading...</div>"}>
      <FailContent />
    </Suspense>
  );
};

export default Fail;
