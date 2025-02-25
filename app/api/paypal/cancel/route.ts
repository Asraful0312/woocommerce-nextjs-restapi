export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import api from "@/lib/woocommerce";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const wooOrderID = searchParams.get("wooOrderID");

    if (!wooOrderID) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Update WooCommerce order status to "cancelled"
    await api.put(`orders/${wooOrderID}`, { status: "cancelled" });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cancel?order_id=${wooOrderID}`
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
