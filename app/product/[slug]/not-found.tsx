import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center">
        <ShoppingBag className="w-24 h-24 text-gray-400 mb-8 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          We couldn&rsquo;t find the product you&rsquo;re looking for. It might
          have been removed or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/products" className="inline-flex items-center">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
