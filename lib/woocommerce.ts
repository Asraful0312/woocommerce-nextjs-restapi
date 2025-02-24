import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL!,
  consumerKey: process.env.WC_CUSTOMER_KEY!,
  consumerSecret: process.env.WC_CUSTOMER_SECRET!,
  version: "wc/v3",
});

export default api;

export const createWooOrder = async (orderData: any) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Update WooCommerce Order
export const updateWooOrder = async (orderId: number, updateData: any) => {
  const response = await api.put(`/orders/${orderId}`, updateData);
  return response.data;
};
