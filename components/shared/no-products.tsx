import { PackageX } from "lucide-react";


export default function NoProducts() {
  return (
    <div className="flex flex-col items-center justify-center my-10 text-center px-4">
      <PackageX className="h-16 w-16 mb-4 text-gray-500" />
      <h2 className="text-2xl font-medium tracking-tight mb-2">
        No products available
      </h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        We couldn&rsquo;t find any products at the moment. Please check back
        later.
      </p>
    </div>
  );
}
