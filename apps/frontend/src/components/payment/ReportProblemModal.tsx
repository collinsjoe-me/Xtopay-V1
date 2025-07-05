"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportProblemModal: React.FC<ReportProblemModalProps> = ({
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-200 transition-all duration-300 ease-out dark:bg-gray-800 dark:ring-gray-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Content */}
        <div className="space-y-5">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Report a Problem
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Having trouble with your payment? Tell us what went wrong so we can help.
          </p>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Describe the issue
            </label>
            <textarea
              className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
              rows={4}
              placeholder="Please describe the problem you're experiencing..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
