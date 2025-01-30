"use client";

import { useState } from "react";
// import "./OrderButton.css"; // Import styles

const OrderButton = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Reset animation after 10 seconds (matches CSS animation duration)
    setTimeout(() => {
      setIsAnimating(false);
    }, 10000);
  };

  return (
    <button className={`order ${isAnimating ? "animate" : ""}`} onClick={handleClick}>
      <span className="default">Complete Order</span>
      <span className="success">
        Order Placed
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
        </svg>
      </span>
      <div className="box"></div>
      <div className="truck">
        <div className="back"></div>
        <div className="front">
          <div className="window"></div>
        </div>
        <div className="light top"></div>
        <div className="light bottom"></div>
      </div>
      <div className="lines"></div>
    </button>
  );
};

export default OrderButton;
