"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderType } from "@/lib/order-types";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import placeholderImg from "@/app/assets/images/placeholder.png";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getOrder = async () => {
    setIsLoading(true);
    if (!orderId) return;
    try {
      const res = await fetch(`/api/order/${orderId}?isLoggedIn=false`);
      if (!res.ok) {
        setError("Failed to fetch order");
        setIsLoading(false);
      }
      const data = await res.json();
      setOrder(data);
    } catch (error: any) {
      console.log(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-5 max-w-[600px] mx-auto mt-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getOrder();
        }}
        className="flex items-center gap-2 mb-4"
      >
        <Input
          onChange={(e) => setOrderId(e.target.value)}
          type="text"
          placeholder="Get order by order ID"
        />
        <Button type="submit" size="icon" variant="secondary">
          <Search className="size-5 shrink-0" />
        </Button>
      </form>

      {/* Skeleton Loader */}
      {!error && isLoading && (
        <div className="flex items-start justify-between gap-5 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 rounded-md"></div>
              <div>
                <div className="w-32 h-4 bg-gray-300 rounded-md mb-2"></div>
                <div className="w-20 h-3 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          ))}
          <div className="w-24 h-8 bg-gray-300 rounded-md"></div>
        </div>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Order Card */}
      {order?.id && !isLoading && !error && (
        <div className="flex items-start justify-between gap-5">
          {order?.line_items.map((item) => (
            <div key={order?.id} className="flex items-center gap-2">
              <Image
                src={item?.image?.src || placeholderImg}
                width={40}
                height={40}
                alt=""
                className="rounded-md"
              />
              <div>
                <h2 className="font-semibold line-clamp-2">{item?.name}</h2>
                <p>
                  {order?.currency_symbol}
                  {order?.total}
                </p>
              </div>
            </div>
          ))}
          <Link className={buttonVariants()} href={`/order/${order?.id}`}>
            Details
          </Link>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
