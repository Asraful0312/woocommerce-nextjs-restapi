import type { FC } from "react";
import { CheckCircle, Truck, Package } from "lucide-react";

interface OrderStatusCardProps {
  orderNumber: string;
  status: "Processing" | "Shipped" | "Delivered";
  estimatedDelivery: string;
}

const OrderStatusCard: FC<OrderStatusCardProps> = ({
  orderNumber,
  status,
  estimatedDelivery,
}) => {
  const getStatusPercentage = () => {
    switch (status) {
      case "Processing":
        return "33.33%";
      case "Shipped":
        return "66.66%";
      case "Delivered":
        return "100%";
      default:
        return "0%";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "Processing":
        return <Package className="w-6 h-6 text-blue-500" />;
      case "Shipped":
        return <Truck className="w-6 h-6 text-yellow-500" />;
      case "Delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Order #{orderNumber}
        </h2>
        {getStatusIcon()}
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Status</span>
          <span className="font-medium">{status}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: getStatusPercentage() }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Estimated Delivery:{" "}
        <span className="font-medium">{estimatedDelivery}</span>
      </p>
      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out">
        View Order Details
      </button>
    </div>
  );
};

export default OrderStatusCard;
