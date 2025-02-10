"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [message, setMessage] = useState("Processing your payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setMessage("No order found.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Timeout after 5s

    fetch(`/api/order-status?orderId=${orderId}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "completed") {
          setMessage("Thank you! Your payment was successful.");
        } else {
          setMessage("Your payment is being processed. Please wait.");
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          setMessage("Server is taking too long. Try refreshing.");
        } else {
          setMessage("There was an issue confirming your payment.");
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, [orderId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">{message}</h1>
      {loading && <p>Loading...</p>}
    </div>
  );
}
