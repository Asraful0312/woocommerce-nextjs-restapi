import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";

export async function PUT(req: Request) {
  const { orderId, userId } = await req.json();
  try {
    const response = await api.put(`orders/${orderId}`, {
      customer_id: userId,
    });


    return NextResponse.json({ success: true, data: response.data });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || "Error updating order",
      },
      { status: error.response?.status || 500 }
    );
  }
}
