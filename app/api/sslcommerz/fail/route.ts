export const dynamic = "force-dynamic";
import api from "@/lib/woocommerce";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type");

    let data;
    if (contentType?.includes("application/json")) {
      data = await req.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await req.text();
      data = Object.fromEntries(new URLSearchParams(formData));
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

    const { tran_id, value_a } = data;

    if (!tran_id || !value_a) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update WooCommerce order with failed status
    await api.put(`orders/${value_a}`, {
      status: "failed",
      transaction_id: tran_id,
    });

    try {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/fail?error=${data.error}`,
        303 // 👈 Add status code 303
      );
    } catch (parseError) {
      console.error("WooCommerce JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse WooCommerce response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment failure processing error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
