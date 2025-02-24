import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import api from "@/lib/woocommerce";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    // Create WooCommerce Order

    const { data: order } = await api.post("orders", orderData);

    // Create Stripe Customer
    const customer = await stripe.customers.create({
      email: order?.billing.email,
      name: order?.billing.first_name,
      metadata: { wooOrderId: order.id },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: customer.id,
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/cancel?session_id={CHECKOUT_SESSION_ID}&order_id=${order?.id}`,
      metadata: {
        wooOrderId: order?.id.toString(), // Ensure it's a string
      },
      line_items: [
        {
          price_data: {
            currency: order?.currency,
            product_data: {
              name: `Order #${order?.id}`,
            },
            unit_amount: Math.round(order?.total * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: {
          wooOrderId: order?.id.toString(), // Sync metadata with PaymentIntent
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
