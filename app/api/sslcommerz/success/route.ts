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

    const { val_id, tran_id, value_a } = data;

    console.log("data from sslc", data);

    if (!val_id || !tran_id || !value_a) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Construct verification URL
    const verifyURL = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${encodeURIComponent(
      process.env.SSLC_STORE_ID || ""
    )}&store_passwd=${encodeURIComponent(
      process.env.SSLC_STORE_PASSWORD || ""
    )}&format=json`;

    // Verify payment with SSLCommerz
    const verifyRes = await fetch(verifyURL);
    const verificationData = await verifyRes.json();
    console.log("SSLCommerz Verification Response:", verificationData);

    if (
      verificationData.status !== "VALID" &&
      verificationData.status !== "VALIDATED"
    ) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // Update WooCommerce order
    await api.put(`orders/${value_a}`, {
      transaction_id: tran_id,
      set_paid: true,
      status: "processing",
      payment_method: verificationData?.card_issuer,
    });

    // Ensure it's valid JSON before parsing
    try {
      // In your success API route
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?order_id=${value_a}&transaction_id=${tran_id}`,
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
    console.error("Payment processing error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
