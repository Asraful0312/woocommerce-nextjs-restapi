"use client";

import { EnhancedButton } from "../ui/enhancedButton";
import {
  PaymentGateway,
  ProductType,
  ProductVariation,
  ShippingMethod,
} from "@/lib/types";
import { Input } from "../ui/input";
import { Loader2, Mail, MapPin, Phone, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import Variation from "../Variation";
import { Label } from "../ui/label";
import PaymentMethod from "./PaymentMethods";
import useVariationStore from "@/stores/useVariationStore";
import useCurrencyStore from "@/stores/useCurrencyStore";
import { useForm } from "react-hook-form";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import { useShippingMethods } from "@/hooks/useShippingMethods";

type Props = {
  product: ProductType;
  open: number | null;
  setOpen: (value: number | null) => void;
};

type PaymentMethod = {
  id: string;
  title: string;
  description: string;
};

type FormData = {
  name: string;
  address: string;
  phone: string;
  email: string;
  account_number?: string;
  transaction_id?: string;
};

const OrderForm = ({ product, open, setOpen }: Props) => {
  //hooks
  const { currency, fetchCurrency } = useCurrencyStore();
  const { selectedVariation } = useVariationStore();
  const { mutate: placeOrder, isPending } = usePlaceOrder();

  //states
  const { data: paymentGetaways } = usePaymentMethods();
  const { data: shippingMethods } = useShippingMethods();

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingMethod | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    account_number: "",
    transaction_id: "",
  });

  const userId = 0;

  console.log(selectedPaymentMethod);

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // distruckture product object
  const { id, type, variations, price, downloadable, virtual } = product || {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  //get shipping method and payment method
  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  //create order
  const onSubmit = (data: FormData) => {
    if (!downloadable && !virtual && !selectedShipping) {
      return alert("Please select a shipping method.");
    }
    if (!selectedPaymentMethod) {
      return alert("Please select a payment method.");
    }
    if (type === "variable" && !selectedVariation?.id) {
      return alert("Please select a product variant.");
    }

    if (
      ["woo_bkash", "woo_nagad"].includes(selectedPaymentMethod?.id) &&
      (!data.account_number || !data.transaction_id)
    ) {
      return alert(
        "Please provide account number and transaction ID for Bkash or Nagad."
      );
    }

    const orderData = {
      customer_id: userId || 0,
      payment_method: selectedPaymentMethod?.id,
      payment_method_title: selectedPaymentMethod?.title,
      set_paid: false,
      billing: {
        first_name: formData.name,
        address_1: formData.address,
        phone: formData.phone,
        email: formData.email,
      },
      line_items: [
        {
          product_id: product.id,
          variation_id:
            type === "variable"
              ? typeof variations !== "number" &&
                variations?.find(
                  (v: ProductVariation) =>
                    v?.name === (selectedVariation?.name || "")
                )?.id
              : undefined,
          quantity: 1,
        },
      ],
      shipping:
        downloadable || virtual
          ? {} // ✅ No shipping required for digital products
          : {
              first_name: formData.name,
              address_1: formData.address,
              phone: formData.phone,
              email: formData.email,
            },

      meta_data: [
        ...(selectedPaymentMethod?.id === "woo_bkash" ||
        selectedPaymentMethod?.id === "woo_nagad"
          ? [
              { key: "account_number", value: formData.account_number },
              { key: "transaction_id", value: formData.transaction_id },
            ]
          : []),
      ],

      shipping_lines:
        downloadable || virtual
          ? [] // ✅ Fix: Ensure empty array for digital products
          : selectedShipping?.method_id
          ? [
              {
                method_id: selectedShipping.method_id,
                method_title: selectedShipping.title,
                total: selectedShipping.settings?.cost?.value || "0",
              },
            ]
          : [],
    };

    placeOrder(orderData);
  };

  return (
    <div
      onClick={() => setOpen(null)}
      className={`fixed inset-0 bg-black/55 z-30 flex items-center justify-center px-5 ${
        open === id ? "block" : "hidden"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-scroll h-screen bg-white p-5 rounded-md w-[500px]"
      >
        {/* close button */}
        <div className="flex justify-end">
          <button onClick={() => setOpen(null)}>
            <X className="size-5 shrink-0" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name" className="leading-6">
              Full Name <span className="text-red-500 text-lg">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <User className="shrink-0 size-4" />
              </div>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                value={formData.name}
                onChange={handleInputChange}
                className="peer ps-9"
                placeholder="John Doe"
                type="text"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="address" className="leading-6">
              Address <span className="text-red-500 text-lg">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <MapPin className="shrink-0 size-4" />
              </div>
              <Input
                id="address"
                className="peer ps-9"
                {...register("address", { required: "Address is required" })}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Dhaka, Bangladesh"
                type="text"
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone" className="leading-6">
              Phone <span className="text-red-500 text-lg">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Phone className="shrink-0 size-4" />
              </div>
              <Input
                id="phone"
                className="peer ps-9"
                value={formData.phone}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Invalid phone number",
                  },
                })}
                onChange={handleInputChange}
                placeholder="01234567801"
                type="text"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email" className="leading-6">
              Email <span className="text-red-500 text-lg">*</span>
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Mail size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              <Input
                id="email"
                className="peer ps-9"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exmple@gmail.com"
                type="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* variations */}
          {type === "variable" && <Variation isGrid variations={variations} />}

          {/* shipping method */}
          {shippingMethods && !virtual && !downloadable && (
            <div>
              <h2>
                Shipping Methods <span className="text-red-500 text-lg">*</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {shippingMethods &&
                  shippingMethods?.map((data) => (
                    <EnhancedButton
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedShipping(data);
                      }}
                      size="sm"
                      variant={
                        selectedShipping?.id === data?.id
                          ? "default"
                          : "outline"
                      }
                      key={data.id}
                    >
                      {data?.title}: {data?.settings?.cost?.value}
                      {` ${currency}`}
                    </EnhancedButton>
                  ))}
              </div>
            </div>
          )}

          {paymentGetaways && (
            <PaymentMethod
              product={product}
              formData={formData}
              handleInputChange={handleInputChange}
              paymentGateways={paymentGetaways as PaymentGateway[]}
              selectedPaymentMethod={selectedPaymentMethod as PaymentMethod}
              register={register}
              errors={errors}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
            />
          )}

          <p>
            Total Price:{" "}
            {selectedVariation?.price
              ? Number(selectedVariation.price) +
                Number(selectedShipping?.settings?.cost?.value || 0)
              : Number(price) +
                Number(selectedShipping?.settings?.cost?.value || 0)}{" "}
            {currency}
          </p>

          <EnhancedButton
            disabled={isPending}
            type="submit"
            effect="shine"
            className="w-full disabled:opacity-70"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-4 shrink-0 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              "Buy Now"
            )}
          </EnhancedButton>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
