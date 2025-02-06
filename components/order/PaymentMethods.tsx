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
import { PaymentGateway, ProductType } from "@/lib/types";
import { sanitize } from "@/lib/utils";

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
  paymentGateways: PaymentGateway[];
  register: any;
  errors: any;
  selectedPaymentMethod: SelectedGateway;
  setSelectedPaymentMethod: (value: SelectedGateway) => void;
};

const PaymentMethod = ({
  product,
  paymentGateways,
  setSelectedPaymentMethod,
  selectedPaymentMethod,
  formData,
  handleInputChange,
  register,
  errors,
}: Props) => {
  return (
    <div className="">
      <h2 className="mb-1">
        Payment Methods <span className="text-red-500">*</span>
      </h2>
      <Select
        onValueChange={(value) => {
          const selectedGateway = paymentGateways.find((pg) => pg.id === value);
          if (selectedGateway) {
            setSelectedPaymentMethod({
              id: selectedGateway.id,
              title: selectedGateway.method_title,
              description: selectedGateway.description as string,
            });
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a payment method" />
        </SelectTrigger>
        <SelectContent>
          {paymentGateways
            .filter(
              (pg) =>
                !(pg.id === "cod" && (product.virtual || product.downloadable))
            )
            .map((paymentGateway) => (
              <SelectItem key={paymentGateway.id} value={paymentGateway.id}>
                {paymentGateway.method_title}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      {selectedPaymentMethod && (
        <div>
          <h3 className="text-lg font-semibold mb-2 mt-4">Payment Details</h3>
          <div
            className=""
            dangerouslySetInnerHTML={{
              __html: sanitize(selectedPaymentMethod?.description),
            }}
          />
        </div>
      )}

      {selectedPaymentMethod &&
        ["woo_bkash", "woo_nagad"].includes(selectedPaymentMethod?.id) && (
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
