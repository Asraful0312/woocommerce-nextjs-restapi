export type OrderType = {
  id: number;
  parent_id: number;
  status: string;
  currency: string;
  version: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  order_key: string;
  billing: AddressType;
  shipping: AddressType;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  customer_ip_address: string;
  customer_user_agent: string;
  created_via: string;
  customer_note: string;
  date_completed: string | null;
  date_paid: string | null;
  cart_hash: string;
  number: string;
  meta_data: any[];
  line_items: LineItemType[];
  tax_lines: any[];
  shipping_lines: any[];
  fee_lines: any[];
  coupon_lines: any[];
  refunds: any[];
  payment_url: string;
  is_editable: boolean;
  needs_payment: boolean;
  needs_processing: boolean;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: string | null;
  date_paid_gmt: string | null;
  currency_symbol: string;
  _links: LinksType;
};

type AddressType = {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
};

type LineItemType = {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: any[];
  meta_data: any[];
  sku: string;
  price: number;
  image: ImageType;
  parent_name: string | null;
};

type ImageType = {
  id: string;
  src: string;
};

type LinksType = {
  self: LinkDetail[];
  collection: LinkDetail[];
};

type LinkDetail = {
  href: string;
  targetHints?: {
    allow: string[];
  };
};

export type OrderNoteType = {
  id: number;
  author: string;
  date_created: string; // ISO date string
  date_created_gmt: string; // ISO date string
  note: string;
  customer_note: boolean;
  _links: {
    self: {
      href: string;
      targetHints?: {
        allow: string[];
      };
    }[];
    collection: {
      href: string;
    }[];
    up: {
      href: string;
    }[];
  };
};
