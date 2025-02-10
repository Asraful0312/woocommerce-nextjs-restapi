import { NextResponse } from "next/server";
import axios from "axios";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. Create user in WordPress
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users`,
      {
        username: email,
        email,
        password,
        name,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );

    const userId = response.data.id;
    console.log("WordPress user created:", response.data);

    // 2. Create a Stripe customer
    const stripeCustomer = await stripe.customers.create({
      email,
      name,
    });
    console.log("Stripe customer created:", stripeCustomer);

    // 3. Update Stripe customer ID using custom plugin endpoint
    const stripeUpdateResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom/v1/update-stripe-customer/`,
      {
        user_id: userId,
        stripe_customer_id: stripeCustomer.id,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );

    console.log("Stripe customer ID updated:", stripeUpdateResponse.data);

    // Return success response
    return NextResponse.json({
      success: true,
      user: response.data,
      stripe: {
        customerId: stripeCustomer.id,
        updateStatus: stripeUpdateResponse.data,
      },
    });
  } catch (error: any) {
    console.error("Error registering user:", error);

    // Enhanced error handling
    let errorMessage = "Error registering user";
    let statusCode = 400;

    if (error.response) {
      // Get the most specific error message available
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error?.message ||
        error.response.data ||
        errorMessage;
      statusCode = error.response.status;
    }

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: statusCode }
    );
  }
}
