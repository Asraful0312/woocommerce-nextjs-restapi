export type OrderType = {
  name: string;
  customer_id: number;
  order_id: number;
  status: string;
  currency: string;
  price: string;
  currency_symbol: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
};
