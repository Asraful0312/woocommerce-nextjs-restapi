import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import api from "@/lib/woocommerce";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${(err as any).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("webhook session", session);

    if (session.metadata && session.metadata.wooOrderId) {
      const wooOrderId = parseInt(session.metadata.wooOrderId, 10);

      await api.put(`orders/${wooOrderId}`, {
        status: "processing",
        set_paid: true,
        transaction_id: session.payment_intent,
        meta_data: [
          { key: "stripe_transaction_id", value: session.payment_intent },
          { key: "stripe_amount", value: session.amount_total! / 100 },
        ],
      });
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const wooOrderId = paymentIntent.metadata.wooOrderId;

    if (wooOrderId) {
      await api.put(`orders/${parseInt(wooOrderId, 10)}`, {
        status: "failed",
        meta_data: [
          {
            key: "stripe_error",
            value:
              paymentIntent.last_payment_error?.message || "Payment failed",
          },
        ],
      });
    }
  } else if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.wooOrderId) {
      await api.put(`orders/${parseInt(session.metadata.wooOrderId, 10)}`, {
        status: "failed",
        meta_data: [
          {
            key: "stripe_error",
            value: "Asynchronous payment failed",
          },
        ],
      });
    }
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.metadata?.wooOrderId) {
      await api.put(`orders/${parseInt(session.metadata.wooOrderId, 10)}`, {
        status: "cancelled",
      });
    }
  }

  return NextResponse.json({ received: true });
}
