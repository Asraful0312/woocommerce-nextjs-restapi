import { NextResponse } from "next/server";
import axios from "axios";

export async function PUT(req: Request) {
  try {
    const { token, userId, name, email, password } = await req.json();

    // Prepare user update data
    const updateData: Record<string, any> = {
      name,
    };

    // Update email only if provided
    if (email) {
      updateData.email = email;
    }

    // Update password only if provided
    if (password) {
      updateData.password = password;
    }

    // Make API request to update user in WordPress
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users/${userId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Use the JWT token from login
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, user: response.data });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Error updating user",
      },
      { status: error.response?.status || 500 }
    );
  }
}
