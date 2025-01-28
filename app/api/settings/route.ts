import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function GET() {
  try {
    // Get selected currency (e.g., BDT, USD)
    const { data: currencyData } = await api.get(
      "settings/general/woocommerce_currency"
    );
    const currencyCode = currencyData.value; // Example: 'BDT', 'USD'

    // Get all currency symbols
    const { data: currencyList } = await api.get("data/currencies");

    // Find the correct symbol for the selected currency
    const currencySymbol = currencyList[currencyCode]?.symbol || currencyCode;

    return NextResponse.json({
      success: true,
      currency: currencyCode,
      symbol: currencySymbol, // Example: '৳' for BDT, '$' for USD
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
