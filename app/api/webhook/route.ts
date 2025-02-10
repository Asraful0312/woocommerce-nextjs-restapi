import { NextResponse } from "next/server";
import Stripe from "stripe";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  console.log("Stripe webhook call");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("🔔 Webhook Received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId || null;

      if (orderId) {
        console.log(`✅ Payment successful for Order ID: ${orderId}`);

        // Update WooCommerce Order to "Processing"
        await api.put(`orders/${orderId}`, {
          status: "processing",
        });

        // Optional: If user is logged in, attach the order to their account
        if (userId) {
          await api.put(`orders/${orderId}`, {
            customer_id: userId,
          });
          console.log(`🔗 Order ${orderId} linked to User ${userId}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Webhook Error:", error.message);
    return NextResponse.json(
      { error: "Webhook handling failed" },
      { status: 400 }
    );
  }
}
