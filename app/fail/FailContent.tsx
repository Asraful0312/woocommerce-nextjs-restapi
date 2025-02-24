"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Wrapper from "@/components/shared/Wrapper";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function FailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  return (
    <Suspense fallback={"<p>Loading...</p>"}>
      <Wrapper className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-center text-2xl font-bold text-destructive">
              Payment Failed
            </CardTitle>
            <p className="text-center text-red-500">{error}</p>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              We&rsquo;re sorry, but your payment could not be processed at this
              time.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• Check your payment details and try again</li>
              <li>• Ensure you have sufficient funds</li>
              <li>• Try a different payment method</li>
            </ul>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button className="w-full" variant="default">
              Try Payment Again
            </Button>
            <div className="text-center text-sm">
              <Link href="/contact" className="text-primary hover:underline">
                Need help? Contact support
              </Link>
            </div>
          </CardFooter>
        </Card>
      </Wrapper>
    </Suspense>
  );
}
