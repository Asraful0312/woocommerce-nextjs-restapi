export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import axios from "axios";


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/jwt-auth/v1/token`,
      {
        username: email,
        password: password,
      }
    );
    
    return NextResponse.json({
      success: true,
      data: response?.data,
    });
  } catch (error: any) {
    console.error("Error logging in:", error.response);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Invalid credentials",
      },
      { status: error.response?.status || 500 }
    );
  }
}
