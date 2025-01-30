"use client";

import { useState } from "react";
import { Download, Copy, CheckCircle, Gift, Code, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DownloadableProductType } from "@/lib/types";

export default function DownloadableProducts({
  products,
}: {
  products: DownloadableProductType[];
}) {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleCopyLink = (downloadUrl: string, downloadId: string) => {
    navigator.clipboard.writeText(downloadUrl).then(() => {
      setCopiedStates((prev) => ({ ...prev, [downloadId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [downloadId]: false }));
      }, 2000);
    });
  };

  const getIcon = (type: DownloadableProductType["download_name"]) => {
    switch (type) {
      case "gift-card":
        return <Gift className="w-6 h-6 text-yellow-500" />;
      case "software":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "source-code":
        return <Code className="w-6 h-6 text-green-500" />;
      default:
        return <Download className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {products?.map((product) => (
        <div
          key={product.download_id}
          className="bg-white shadow-md rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border"
        >
          <div className="flex items-center gap-4">
            {getIcon(product.download_name)}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {product.product_name}
              </h2>
              <p className="text-sm text-gray-600">
                Downloads remaining:{" "}
                {product.downloads_remaining === "unlimited"
                  ? "∞"
                  : product.downloads_remaining}
                {product.access_expires !== "never" &&
                  ` • Expires: ${new Date(
                    product.access_expires
                  ).toLocaleDateString()}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              disabled={Number(product.downloads_remaining) === 0}
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto text-wrap"
              onClick={() =>
                handleCopyLink(product.download_url, product.download_id)
              }
            >
              {copiedStates[product.download_id] ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {product?.file?.file.substring(1, 50)}...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {product?.file?.file.substring(1, 50)}...
                </>
              )}
            </Button>
            <Button
              disabled={Number(product.downloads_remaining) === 0}
              variant="default"
              size="sm"
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={() => window.open(product.download_url, "_blank")}
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
