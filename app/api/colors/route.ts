import { NextResponse } from "next/server";

export async function GET() {
  const authHeader = Buffer.from(
    `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
  ).toString("base64");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/custom/v1/customizer`,
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch primary color" },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({ primary_color: data.colors.primary_color });
  } catch (error) {
    console.log("color error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
