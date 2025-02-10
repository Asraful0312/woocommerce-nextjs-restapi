import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Frown } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white  px-4">
      <Frown className="w-24 h-24 mb-8 animate-bounce" />
      <h1 className="text-6xl font-bold mb-4 text-center">404</h1>
      <h2 className="text-3xl font-semibold mb-6 text-center">
        Oops! Page Not Found
      </h2>
      <p className="text-xl mb-8 text-center max-w-md">
        We&rsquo;ve searched high and low, but couldn&rsquo;t find the page
        you&rsquo;re looking for.
      </p>
      <Button asChild className="bg-white text-purple-600 hover:bg-purple-100">
        <Link href="/" className="inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
    </div>
  );
}
