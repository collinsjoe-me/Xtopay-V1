"use client";
import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StatusModalProps {
  isOpen: boolean;
  status: "success" | "failed" | "insufficient";
  title: string;
  description: string;
  onClose: () => void;
  onAction?: () => void;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  status,
  title,
  description,
  onClose,
  onAction,
}) => {
  // Status colors and icons
  const statusConfig = {
    success: {
      icon: <CheckCircle className="h-12 w-12 text-[#4ade80]" />,
      color: "bg-[#4ade80]/10",
      border: "border-[#4ade80]/20",
      button: "bg-[#4ade80] hover:bg-[#3bc271]",
    },
    failed: {
      icon: <XCircle className="h-12 w-12 text-[#f87171]" />,
      color: "bg-[#f87171]/10",
      border: "border-[#f87171]/20",
      button: "bg-[#f87171] hover:bg-[#e66767]",
    },
    insufficient: {
      icon: <AlertCircle className="h-12 w-12 text-[#fbbf24]" />,
      color: "bg-[#fbbf24]/10",
      border: "border-[#fbbf24]/20",
      button: "bg-[#fbbf24] hover:bg-[#e9b421]",
    },
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with blur effect */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            className={`relative z-10 w-full max-w-md overflow-hidden rounded-2xl border ${statusConfig[status].border} bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-2xl`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Animated status bar */}
            <motion.div
              className={`h-1.5 ${statusConfig[status].color}`}
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 10, ease: "linear" }}
            />

            <div className="p-6">
              {/* Icon with pulse animation */}
              <motion.div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${statusConfig[status].color}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                {statusConfig[status].icon}
              </motion.div>

              <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="mb-6 text-center text-gray-600 dark:text-gray-300">
                {description}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                {status === "success" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAction}
                    className={`${statusConfig[status].button} rounded-lg px-6 py-3 font-medium text-white transition-all`}
                  >
                    Continue
                  </motion.button>
                )}
                {status === "failed" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAction}
                    className={`${statusConfig[status].button} rounded-lg px-6 py-3 font-medium text-white transition-all`}
                  >
                    Try Again
                  </motion.button>
                )}
                {status === "insufficient" && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAction}
                    className={`${statusConfig[status].button} rounded-lg px-6 py-3 font-medium text-white transition-all`}
                  >
                    Add Funds
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;