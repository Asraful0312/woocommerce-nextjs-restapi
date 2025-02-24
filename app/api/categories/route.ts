export const dynamic = "force-dynamic";
import api from "@/lib/woocommerce";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const perPage = searchParams.get("per_page") || "10";
  const page = searchParams.get("page") || "1";
  try {
    const params: Record<string, any> = {
      per_page: parseInt(perPage),
      page: parseInt(page),
    };
    const { data: categories } = await api.get("products/categories", params);

    return NextResponse.json(categories);
  } catch (error) {
    console.log("category error", error);
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
