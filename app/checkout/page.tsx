"use client";

import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Rayhan Doe",
          email: "rayhan@example.com",
          productId: 129, // Replace with actual product ID
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError("Failed to redirect to payment");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Checkout</h1>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md"
      >
        {loading ? "Redirecting..." : "Pay with Stripe"}
      </button>
    </div>
  );
}
