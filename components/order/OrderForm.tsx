"use client";

import { EnhancedButton } from "../ui/enhancedButton";
import { ProductType, ProductVariation, ShippingMethod } from "@/lib/types";
import { Input } from "../ui/input";
import { Loader2, Mail, MapPin, Phone, User, X } from "lucide-react";
import { useState } from "react";
import Variation from "../Variation";
import { Label } from "../ui/label";
import PaymentMethod from "./PaymentMethods";
import useVariationStore from "@/stores/useVariationStore";
import { useForm } from "react-hook-form";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useAttributeStore } from "@/stores/useAttributesStore";
import AttributeSelector from "../Attributes";
import { useAuthStore } from "@/stores/useAuthStore";
import SuccessPopup from "./OrderSuccessCard";
import ShippingMethods from "./ShippingMethods";
import { usePlaceSSLCOrder } from "@/hooks/usePlaceSSLCOrder";
import TotalPrice from "./TotalPrice";
import { usePlaceStripeOrder } from "@/hooks/usePlaceStripeOrder";
import { usePlacePaypalOrder } from "@/hooks/usePlacePaypalOrder";

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
  const { selectedVariation } = useVariationStore();
  const { userId } = useAuthStore();

  //states
  const { selectedAttributes } = useAttributeStore();
  const [quantity, setQuantity] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const {
    mutate: placeOrder,
    isPending,
    data,
  } = usePlaceOrder({
    showSuccessPopup,
    setShowSuccessPopup,
  });
  const {
    mutate: placeSSLCOrder,
    isPending: sslcLoading,
    error: sslcError,
  } = usePlaceSSLCOrder();
  const { mutate: placeStripeOrder, isPending: stripeLoading } =
    usePlaceStripeOrder();
  const { mutate: placePaypalOrder, isPending: paypalLoading } =
    usePlacePaypalOrder();

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

  //react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // destructure product object
  const {
    id,
    type,
    variations,
    price,
    downloadable,
    virtual,
    attributes,
    sold_individually,
  } = product || {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;

    const stockQuantity =
      selectedVariation?.stock_quantity ?? product.stock_quantity;

    if (typeof stockQuantity !== "number") {
      console.error("Stock quantity is invalid.");
      return;
    }

    if (value > stockQuantity) {
      alert("Selected quantity exceeds available stock.");
      return;
    }

    setQuantity(value);
  };

  //create order
  const onSubmit = (data: FormData) => {
    if (virtual && downloadable && !userId) {
      return alert("You must be logged in to order this item!");
    }

    const availableStock =
      type === "variable"
        ? selectedVariation?.stock_quantity
        : product.stock_quantity;

    const isInStock =
      type === "variable"
        ? selectedVariation?.stock_status === "instock"
        : product.stock_status === "instock";

    // Check stock quantity but allow if stock_status is "instock"
    if (
      !sold_individually &&
      !isInStock &&
      (!availableStock || quantity > availableStock)
    ) {
      return alert("Selected quantity exceeds available stock.");
    }
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
        city: "noakhali", // Add these fields
        postcode: "1234",
        country: "bangladesh",
        state: "chottogram",
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
          quantity,
          meta_data: Object.entries(selectedAttributes).map(([key, value]) => ({
            key,
            value,
          })), // ✅ Add attributes here
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
        selectedPaymentMethod?.id === "woo_nagad" ||
        selectedPaymentMethod?.id === "woo_rocket" ||
        selectedPaymentMethod?.id === "woo_upay"
          ? [
              { key: "account_number", value: formData.account_number },
              { key: "transaction_id", value: formData.transaction_id },
            ]
          : []),
      ],
      transaction_id: formData.transaction_id || "",
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

    if (selectedPaymentMethod?.id === "sslcommerz") {
      placeSSLCOrder(orderData);
    } else if (selectedPaymentMethod?.id === "stripe") {
      placeStripeOrder(orderData);
    } else if (selectedPaymentMethod?.id === "paypal") {
      placePaypalOrder(orderData);
    } else {
      placeOrder(orderData);
    }
  };
  console.log(sslcError);

  return (
    <div
      onClick={() => setOpen(null)}
      className={`fixed inset-0 bg-black/55 py-12 z-[90] max-h-screen flex items-center justify-center px-5 ${
        open === id ? "block" : "hidden"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="overflow-y-scroll max-h-[700px] md:h-screen bg-white p-5 rounded-md w-[500px]"
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

          <div className="pt-5">
            <h2 className="font-semibold">
              Stock:{" "}
              <span
                className={` font-normal ${
                  product?.stock_quantity && product?.stock_quantity === 0
                    ? "bg-red-500"
                    : product?.stock_status === "outofstock"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {product?.stock_quantity
                  ? product?.stock_quantity + " in stock"
                  : product?.stock_status === "outofstock"
                  ? "Out Of Stock"
                  : product?.stock_status}
              </span>
            </h2>
          </div>

          {product?.stock_quantity &&
            product?.stock_quantity > 0 &&
            !sold_individually && (
              <div className="space-y-1">
                <Label htmlFor="quantity" className="leading-6">
                  Quantity <span className="text-red-500 text-lg">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={
                      selectedVariation?.stock_quantity !== null
                        ? selectedVariation?.stock_quantity
                        : undefined
                    }
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="peer"
                  />
                </div>
              </div>
            )}

          {/* variations */}
          {type === "variable" && <Variation isGrid variations={variations} />}
          {type !== "variable" && attributes && attributes.length > 0 && (
            <AttributeSelector attributes={attributes} />
          )}

          {/* shipping method */}
          {!virtual && !downloadable && (
            <ShippingMethods
              selectedShipping={selectedShipping as ShippingMethod}
              setSelectedShipping={setSelectedShipping}
            />
          )}

          <PaymentMethod
            product={product}
            formData={formData}
            handleInputChange={handleInputChange}
            selectedPaymentMethod={selectedPaymentMethod as PaymentMethod}
            register={register}
            errors={errors}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />

          <TotalPrice
            price={price}
            quantity={quantity}
            selectedShipping={selectedShipping}
          />

          {sslcError && (
            <p className="text-center text-red-500">{sslcError.message}</p>
          )}
          <EnhancedButton
            disabled={
              !!isPending || !!sslcLoading || !!stripeLoading || !!paypalLoading
            }
            type="submit"
            effect="shine"
            className="w-full disabled:opacity-70"
          >
            {!!(isPending || sslcLoading || stripeLoading || paypalLoading) ? (
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
      <SuccessPopup
        isVisible={showSuccessPopup}
        orderId={data?.order_id}
        onClose={() => setShowSuccessPopup(false)}
      />
    </div>
  );
};

export default OrderForm;
