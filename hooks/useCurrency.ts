import { useQuery } from "@tanstack/react-query";

type CurrencyType = {
  currency: string;
  symbol: string;
};

const fetchCurrency = async (): Promise<CurrencyType> => {
  const res = await fetch(`/api/settings`);
  if (!res.ok) throw new Error("Failed to fetch currency");
  const data = await res.json();
  return { currency: data.currency, symbol: data.symbol };
};

export const useCurrency = () => {
  return useQuery<CurrencyType>({
    queryKey: ["currency"],
    queryFn: () => fetchCurrency(),
  });
};
