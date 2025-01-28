import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users`,
      {
        username: email,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WORDPRESS_ADMIN_USER}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
          ).toString("base64")}`,
        },
      }
    );

    return NextResponse.json({ success: true, user: response.data });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Error registering user",
      },
      { status: 400 }
    );
  }
}
