"use client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { ProductType } from "@/lib/types";
import { sanitize } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type SelectedGateway = {
  id: string;
  title: string;
  description: string;
};

type Props = {
  product: ProductType;
  formData: {
    name: string;
    address: string;
    phone: string;
    email: string;
    account_number: string;
    transaction_id: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: any;
  errors: any;
  selectedPaymentMethod: SelectedGateway;
  setSelectedPaymentMethod: (value: SelectedGateway) => void;
};

const PaymentMethod = ({
  product,
  setSelectedPaymentMethod,
  selectedPaymentMethod,
  formData,
  handleInputChange,
  register,
  errors,
}: Props) => {
  const { data: paymentGateways, isLoading, error } = usePaymentMethods();

  const valueChange = (value: string) => {
    if (value === "sslcommerz") {
      setSelectedPaymentMethod({
        id: "sslcommerz",
        title: "SSLCommerce Methods",
        description: "You can pay using Bkash or Rocket via SSLC.",
      });
    } else if (value === "stripe") {
      setSelectedPaymentMethod({
        id: "stripe",
        title: "Stripe Credit Card (Visa/MasterCard)",
        description: "You can pay using your credit card via stripe.",
      });
    } else if (value === "paypal") {
      setSelectedPaymentMethod({
        id: "paypal",
        title: "Paypal",
        description: "You can pay using paypal",
      });
    } else {
      const selectedGateway = paymentGateways?.find((pg) => pg.id === value);
      if (selectedGateway) {
        setSelectedPaymentMethod({
          id: selectedGateway.id,
          title: selectedGateway.method_title,
          description: selectedGateway.description as string,
        });
      }
    }
  };

  return (
    <div className="">
      <h2 className="mb-1">
        Payment Methods <span className="text-red-500">*</span>
      </h2>
      {isLoading && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="shrink-0 size-4 animate-spin text-gray-400" />
          <p className="text-gray-400">Getting Payment Methods...</p>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error.message}</p>}

      {!isLoading &&
        !error &&
        paymentGateways &&
        paymentGateways?.length > 0 && (
          <Select onValueChange={(value) => valueChange(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentGateways
                ?.filter(
                  (pg) =>
                    !(
                      pg.id === "cod" &&
                      (product.virtual || product.downloadable)
                    )
                )
                ?.map(
                  (paymentGateway) =>
                    paymentGateway.title && (
                      <SelectItem
                        key={paymentGateway.id}
                        value={paymentGateway.id}
                      >
                        {paymentGateway?.id === "stripe_cc"
                          ? "Stripe"
                          : paymentGateway?.method_title}
                      </SelectItem>
                    )
                )}
              <SelectItem value="sslcommerz">SSLCommerce Methods</SelectItem>
              <SelectItem value="paypal">Paypal</SelectItem>
              <SelectItem value="stripe">
                Stripe Credit Card (Visa/MasterCard)
              </SelectItem>
            </SelectContent>
          </Select>
        )}

      {selectedPaymentMethod && (
        <div>
          <h3 className="text-lg font-semibold mb-2 mt-4">Payment Details</h3>
          <div
            className="prose bg-gray-100 p-2 rounded text-sm"
            dangerouslySetInnerHTML={{
              __html: sanitize(selectedPaymentMethod?.description),
            }}
          />
        </div>
      )}

      {selectedPaymentMethod &&
        ["woo_bkash", "woo_nagad", "woo_rocket", "woo_upay"].includes(
          selectedPaymentMethod?.id
        ) && (
          <div className="mt-4 space-y-2">
            <div>
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                {...register("account_number", {
                  required: "Account number is required",
                })}
                value={formData.account_number}
                onChange={handleInputChange}
                placeholder="01712345678"
                id="account_number"
              />
              {errors.account_number && (
                <p className="text-red-500 text-sm">
                  {errors.account_number.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="transaction_id">Transaction ID</Label>
              <Input
                {...register("transaction_id", {
                  required: "Transaction ID is required",
                })}
                value={formData.transaction_id}
                onChange={handleInputChange}
                placeholder="CAJ567P90R"
                id="transaction_id"
              />
            </div>
            {errors.transaction_id && (
              <p className="text-red-500 text-sm">
                {errors.transaction_id.message}
              </p>
            )}
          </div>
        )}
    </div>
  );
};

export default PaymentMethod;
