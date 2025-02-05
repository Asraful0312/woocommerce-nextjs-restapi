export type ProductType = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  downloads: string[]; // Adjust type based on the structure of download objects, if any.
  download_limit: number;
  download_expiry: number;
  external_url: string;
  button_text: string;
  tax_status: string;
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  backorders: string;
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  upsell_ids: number[];
  cross_sell_ids: number[];
  parent_id: number;
  purchase_note: string;
  categories: { id: number; name: string; slug: string }[]; // Adjust structure if necessary
  tags: { id: number; name: string; slug: string }[]; // Adjust structure if necessary
  images: { id: number; src: string; name: string; alt: string }[]; // Adjust structure if necessary
  attributes: {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
  }[];
  default_attributes: {
    id: number;
    name: string;
    option: string;
  }[];
  variations: ProductVariation[];
  grouped_products: number[];
  menu_order: number;
  price_html: string;
  related_ids: number[];
  meta_data: { id: number; key: string; value: "" }[]; // Adjust `value` type if necessary
  stock_status: string;
  has_options: boolean;
  post_password: string;
  yoast_head_json: YoastHeadJson;
  global_unique_id: string;
  brands: { id: number; name: string; slug: string }[]; // Adjust structure if necessary
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
  };
};

export type YoastHeadJson = {
  title: string;
  description: string;
  robots: {
    index: string;
    follow: string;
    "max-snippet": string;
    "max-image-preview": string;
    "max-video-preview": string;
  };
  canonical: string;
  og_locale: string;
  og_type: string;
  og_title: string;
  og_description: string;
  og_url: string;
  og_site_name: string;
  article_modified_time: string;
  og_image: {
    width: number;
    height: number;
    url: string;
    type: string;
  }[];
  twitter_card: string;
  twitter_misc: {
    "Est. reading time": string;
  };
  schema: {
    "@context": string;
    "@graph": Array<
      | {
          "@type": string[];
          "@id": string;
          url: string;
          name: string;
          isPartOf: {
            "@id": string;
          };
          primaryImageOfPage: {
            "@id": string;
          };
          image: {
            "@id": string;
          };
          thumbnailUrl: string;
          datePublished: string;
          dateModified: string;
          description: string;
          breadcrumb: {
            "@id": string;
          };
          inLanguage: string;
          potentialAction: Array<{
            "@type": string;
            target: string[];
          }>;
        }
      | {
          "@type": "ImageObject";
          inLanguage: string;
          "@id": string;
          url: string;
          contentUrl: string;
          width: number;
          height: number;
        }
      | {
          "@type": "BreadcrumbList";
          "@id": string;
          itemListElement: Array<{
            "@type": "ListItem";
            position: number;
            name: string;
            item?: string;
          }>;
        }
      | {
          "@type": "WebSite";
          "@id": string;
          url: string;
          name: string;
          description: string;
          publisher: {
            "@id": string;
          };
          potentialAction: Array<{
            "@type": string;
            target: {
              "@type": string;
              urlTemplate: string;
            };
            "query-input": {
              "@type": string;
              valueRequired: boolean;
              valueName: string;
            };
          }>;
          inLanguage: string;
        }
      | {
          "@type": "Organization";
          "@id": string;
          name: string;
          url: string;
          logo: {
            "@type": "ImageObject";
            inLanguage: string;
            "@id": string;
            url: string;
            contentUrl: string;
            width: number;
            height: number;
            caption: string;
          };
          image: {
            "@id": string;
          };
        }
    >;
  };
};

export type AttributesType = {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
};

export type ProductVariation = {
  id: number;
  type: "variation";
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  description: string;
  permalink: string;
  sku: string;
  global_unique_id: string;
  price: string;
  regular_price: string;
  sale_price: string;
  date_on_sale_from: string | null;
  date_on_sale_from_gmt: string | null;
  date_on_sale_to: string | null;
  date_on_sale_to_gmt: string | null;
  on_sale: boolean;
  status: "publish" | "draft" | "pending" | "private";
  purchasable: boolean;
  virtual: boolean;
  downloadable: boolean;
  downloads: any[]; // If downloads have a specific structure, replace `any` with a type
  download_limit: number;
  download_expiry: number;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  low_stock_amount: number | null;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_class: string;
  shipping_class_id: number;
  image: {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
  };
  attributes: {
    id: number;
    name: string;
    slug: string;
    option: string;
  }[];
  menu_order: number;
  meta_data: any[]; // If metadata has a specific structure, replace `any` with a type
  name: string;
  parent_id: number;
  _links: {
    self: {
      href: string;
      targetHints?: {
        allow: ("GET" | "POST" | "PUT" | "PATCH" | "DELETE")[];
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

export type ShippingMethod = {
  id: number;
  instance_id: number;
  title: string;
  order: number;
  enabled: boolean;
  method_id: string;
  method_title: string;
  method_description: string;
  settings: {
    title: ShippingSetting;
    tax_status: ShippingSetting & { options: Record<string, string> };
    cost: ShippingSetting;
  };
  _links: {
    self: Link[];
    collection: Link[];
    describes: Link[];
  };
};

export type PaymentGateway = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  enabled: boolean;
  method_title: string;
  method_description: string;
  method_supports: string[];
  settings: {
    is_dismissed: {
      id: string;
      label: string;
      description: string;
      type: string;
      value: string;
      default: string;
      tip: string;
      placeholder: string;
    };
  };
  needs_setup: boolean;
  post_install_scripts: any[]; // Assuming it can contain different types of scripts
  settings_url: string;
  connection_url: string | null;
  setup_help_text: string | null;
  required_settings_keys: string[];
  _links: {
    self: {
      href: string;
      targetHints: {
        allow: string[];
      };
    }[];
    collection: {
      href: string;
    }[];
  };
};

type ShippingSetting = {
  id: string;
  label: string;
  description: string;
  type: string;
  value: string;
  default: string;
  tip: string;
  placeholder: string;
};

type Link = {
  href: string;
  targetHints?: {
    allow: string[];
  };
};

export type DownloadableProductType = {
  download_id: string;
  download_url: string;
  product_id: number;
  product_name: string;
  download_name: string;
  order_id: number;
  order_key: string;
  downloads_remaining: string; // "10" as string, could be changed to `number` if needed
  access_expires: string; // "never" or a date string
  access_expires_gmt: string; // "never" or a date string
  file: {
    name: string;
    file: string; // File URL
  };
  _links: {
    collection: { href: string }[];
    product: { href: string }[];
    order: { href: string }[];
  };
};

//user types
type AvatarUrls = {
  "24": string;
  "48": string;
  "96": string;
};

type WooCommerceMeta = {
  variable_product_tour_shown: string;
  activity_panel_inbox_last_read: string;
  activity_panel_reviews_last_read: string;
  categories_report_columns: string;
  coupons_report_columns: string;
  customers_report_columns: string;
  orders_report_columns: string;
  products_report_columns: string;
  revenue_report_columns: string;
  taxes_report_columns: string;
  variations_report_columns: string;
  dashboard_sections: string;
  dashboard_chart_type: string;
  dashboard_chart_interval: string;
  dashboard_leaderboard_rows: string;
  homepage_layout: string;
  homepage_stats: string;
  task_list_tracked_started_tasks: string;
  android_app_banner_dismissed: string;
  launch_your_store_tour_hidden: string;
  coming_soon_banner_dismissed: string;
};

type Links = {
  self: Link[];
  collection: Link[];
};

export type UserType = {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: AvatarUrls;
  meta: any[]; // Can be refined if meta has a specific structure
  yoast_head: string | null;
  yoast_head_json: any | null; // Can be typed more precisely if needed
  is_super_admin: boolean;
  woocommerce_meta: WooCommerceMeta;
  _links: Links;
};
