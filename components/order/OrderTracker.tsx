"use client";

import {
  ClipboardCheck,
  CheckCheck,
  Pizza,
  Truck,
  SmileIcon,
} from "lucide-react";
import { motion } from "framer-motion";

interface OrderTrackingProps {
  currentStatus:
    | "placed"
    | "confirmed"
    | "preparation"
    | "delivery"
    | "complete";
}

export default function OrderTracking({
  currentStatus = "confirmed",
}: OrderTrackingProps) {
  const steps = [
    { id: "placed", title: "Order Placed", icon: ClipboardCheck },
    { id: "confirmed", title: "Order confirmation", icon: CheckCheck },
    { id: "preparation", title: "Preparation", icon: Pizza },
    { id: "delivery", title: "Out for delivery", icon: Truck },
    { id: "complete", title: "Complete", icon: SmileIcon },
  ];

  const getStatus = (stepId: string) => {
    const currentIdx = steps.findIndex((step) => step.id === currentStatus);
    const stepIdx = steps.findIndex((step) => step.id === stepId);

    if (stepIdx < currentIdx) return "complete";
    if (stepIdx === currentIdx) return "current";
    return "upcoming";
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-8"
      >
        Track delivery status
      </motion.h2>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-[2.25rem] left-0 w-full h-px bg-gray-200">
          <motion.div
            className="absolute h-full bg-orange-500"
            initial={{ width: "0%" }}
            animate={{
              width: `${
                steps.findIndex((step) => step.id === currentStatus) * 25
              }%`,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const status = getStatus(step.id);
            return (
              <motion.div
                key={step.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="mb-3">
                  <motion.div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                      ${
                        status === "complete"
                          ? "border-orange-500 bg-orange-500 text-white"
                          : status === "current"
                          ? "border-orange-500 bg-white"
                          : "border-gray-300 bg-white"
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={
                      status === "current"
                        ? {
                            scale: [1, 1.1, 1],
                            transition: {
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            },
                          }
                        : {}
                    }
                  >
                    <motion.div
                      animate={
                        status === "complete"
                          ? {
                              rotate: 360,
                            }
                          : {}
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon
                        className={`w-5 h-5 
                        ${
                          status === "complete"
                            ? "text-white"
                            : status === "current"
                            ? "text-orange-500"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div
                  className={`text-sm font-medium text-center
                    ${
                      status === "complete"
                        ? "text-gray-600"
                        : status === "current"
                        ? "text-orange-500"
                        : "text-gray-300"
                    }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                >
                  {step.title}
                  {status === "current" && (
                    <motion.div
                      className="h-1 bg-orange-500 mt-1 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
