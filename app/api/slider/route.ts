import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authHeader = btoa(
      `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
    );

    console.log("auth header", authHeader);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom/v1/customizer`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();

    return NextResponse.json(data);
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
