export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();
    if (!accessToken) {
      throw new Error("No access token provided");
    }

    // Fetch user data from Google API
    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!googleUser?.email) {
      throw new Error("No email found in Google response");
    }

    const { email, given_name: firstName, family_name: lastName } = googleUser;

    // Generate password
    const password = crypto
      .createHmac("sha256", process.env.SECRET_PEPPER!)
      .update(email)
      .digest("hex");

    // Check if user exists and get their data
    let wordpressUser = null;
    try {
      const userCheck = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/wp/v2/users`,
        {
          params: { search: email },
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
            ).toString("base64")}`,
          },
        }
      );

      if (userCheck.data.length > 0) {
        // User exists, store their data
        wordpressUser = userCheck.data[0];
      } else {
        // Create new user
        const wpResponse = await axios.post(
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
                `${process.env.WORDPRESS_ADMIN_USERNAME}:${process.env.WORDPRESS_ADMIN_PASSWORD}`
              ).toString("base64")}`,
            },
          }
        );

        wordpressUser = wpResponse.data;
      }

      // Get JWT token
      const jwtResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/jwt-auth/v1/token`,
        {
          username: email,
          password: password,
        }
      );

      // Extract only the needed user data to avoid circular references
      const userData = {
        id: wordpressUser.id,
        email: wordpressUser.email,
        name: wordpressUser.name,
        firstName: wordpressUser.first_name,
        lastName: wordpressUser.last_name,
        nickname: wordpressUser.nickname,
        slug: wordpressUser.slug,
        roles: wordpressUser.roles,
      };

      return NextResponse.json({
        success: true,
        token: jwtResponse.data.token,
        user: userData,
        isNewUser: !userCheck.data.length,
      });
    } catch (error) {
      console.error("Error managing WordPress user:", error);
      throw error;
    }
  } catch (error: any) {
    console.error("Google login error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message || "Google authentication failed",
      },
      { status: 500 }
    );
  }
}
