"use client";
import { useSingleOrder } from "@/hooks/useSingleOrder";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useWindowSize } from "@react-hook/window-size";
import { buttonVariants } from "@/components/ui/enhancedButton";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { data: order, isLoading, error } = useSingleOrder(orderId || "");
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    if (order && order?.status !== "processing") return router.replace("/");
    if (!isLoading && order) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, order, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto my-4 bg-gray-300 rounded-full p-2 w-16 h-16 flex items-center justify-center">
              <Skeleton className="w-8 bg-gray-300 h-8" />
            </div>
            <Skeleton className="h-6 bg-gray-300 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-4 bg-gray-300 w-3/4 mx-auto mb-4" />
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <Skeleton className="h-5 bg-gray-300 w-1/2 mb-2" />
              <Skeleton className="h-4 bg-gray-300 w-3/4 mb-2" />
              <Skeleton className="h-4 bg-gray-300 w-1/2 mb-2" />
              <Skeleton className="h-4 bg-gray-300 w-1/3" />
            </div>
            <Skeleton className="h-4 bg-gray-300 w-2/3 mx-auto" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 bg-gray-300 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!isLoading && error) {
    return <p className="py-12 text-center bg-red-500">{error?.message}</p>;
  }

  return (
    <Suspense
      fallback={`<div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto my-4 bg-gray-300 rounded-full p-2 w-16 h-16 flex items-center justify-center">
              <Skeleton className="w-8 bg-gray-300 h-8" />
            </div>
            <Skeleton className="h-6 bg-gray-300 w-2/3 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-4 bg-gray-300 w-3/4 mx-auto mb-4" />
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <Skeleton className="h-5 bg-gray-300 w-1/2 mb-2" />
              <Skeleton className="h-4 bg-gray-300 w-3/4 mb-2" />
              <Skeleton className="h-4 bg-gray-300 w-1/2 mb-2" />
              <Skeleton className="h-4 bg-gray-300 w-1/3" />
            </div>
            <Skeleton className="h-4 bg-gray-300 w-2/3 mx-auto" />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Skeleton className="h-10 bg-gray-300 w-32" />
          </CardFooter>
        </Card>
      </div>`}
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        {showConfetti && <Confetti width={width} height={height} />}
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto my-4 bg-green-100 text-green-600 rounded-full p-2 w-16 h-16 flex items-center justify-center">
              <CheckCircle size={32} />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-center">
            <p className="text-gray-600 mb-4">
              Thank you for your purchase. Your order has been processed
              successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Order Details
              </h3>
              <p className="text-sm text-gray-600">Order #: {order?.id}</p>
              <p className="text-sm text-gray-600">
                Amount: {order?.total} {order?.currency}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
              <Link
                className={buttonVariants({
                  variant: "link",
                  effect: "hoverUnderline",
                })}
                href={`/order/${orderId}`}
              >
                Track Order
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email
              address.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link
              href="/"
              className={buttonVariants({
                className: "bg-green-600 hover:bg-green-700 text-white",
              })}
            >
              Return to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </div>
    </Suspense>
  );
};

export default SuccessContent;
