"use client";

import {
  ClipboardCheck,
  CheckCheck,
  Truck,
  Cog,
  PauseCircle,
} from "lucide-react";
import { motion } from "framer-motion";

interface OrderTrackingProps {
  currentStatus: string;
}

export default function OrderTracking({ currentStatus }: OrderTrackingProps) {
  const steps = [
    { id: "pending", title: "Order Placed", icon: ClipboardCheck },
    { id: "processing", title: "Processing", icon: Cog },
    { id: "on-hold", title: "On Hold", icon: PauseCircle },
    { id: "shipped", title: "Shipped", icon: Truck },
    { id: "completed", title: "Completed", icon: CheckCheck },
  ];

  const getStatus = (stepId: string) => {
    const currentIdx = steps.findIndex((step) => step.id === currentStatus);
    const stepIdx = steps.findIndex((step) => step.id === stepId);

    if (currentIdx === -1) return "upcoming";
    if (stepIdx < currentIdx) return "complete";
    if (stepIdx === currentIdx) return "current";
    return "upcoming";
  };

  const currentIndex = steps.findIndex((step) => step.id === currentStatus);
  const progressWidth =
    currentIndex >= 0 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="w-full mx-auto p-6">
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
            className="absolute h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${progressWidth}%` }}
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
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      status === "complete"
                        ? "border-primary bg-primary text-white"
                        : status === "current"
                        ? "border-primary bg-white"
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
                      animate={status === "complete" ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <step.icon
                        className={`w-5 h-5 ${
                          status === "complete"
                            ? "text-white"
                            : status === "current"
                            ? "text-primary"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div
                  className={`text-sm font-medium text-center ${
                    status === "complete"
                      ? "text-gray-600"
                      : status === "current"
                      ? "text-primary"
                      : "text-gray-300"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 }}
                >
                  {step.title}
                  {status === "current" && (
                    <motion.div
                      className="h-1 bg-primary mt-1 rounded-full"
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
