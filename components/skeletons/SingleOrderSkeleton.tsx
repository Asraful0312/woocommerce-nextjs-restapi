"use client";

import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/shared/Wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Package, Truck } from "lucide-react";

const SingleOrderSkeleton = () => {
  return (
    <Wrapper className="p-4">
      <Skeleton className="bg-gray-300 h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="bg-gray-300 h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <Skeleton className="bg-gray-300 h-4 w-20 mb-1" />
                <Skeleton className="bg-gray-300 h-4 w-32" />
              </div>
              <Skeleton className="bg-gray-300 h-6 w-20 rounded-full" />
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Skeleton className="bg-gray-300 w-16 h-16 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="bg-gray-300 h-4 w-40 mb-1" />
                    <Skeleton className="bg-gray-300 h-4 w-24" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="bg-gray-300 h-4 w-16 mb-1" />
                    <Skeleton className="bg-gray-300 h-4 w-10" />
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between">
                  <Skeleton className="bg-gray-300 h-4 w-20" />
                  <Skeleton className="bg-gray-300 h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          {[{ icon: CreditCard }, { icon: Package }, { icon: Truck }].map(
            (item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Skeleton className="mr-2 h-4 w-4 bg-gray-300" />{" "}
                    <Skeleton className="bg-gray-300 h-6 w-32" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-40 bg-gray-300" />
                  ))}
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default SingleOrderSkeleton;
