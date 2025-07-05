"use client";
import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { Phone, ChevronDown } from "lucide-react";

interface WalletPaymentFormProps {
  onPaymentInitiated: () => void;
}

interface WalletPaymentData {
  walletProvider: string;
  phoneNumber: string;
}

const WalletPaymentForm: React.FC<WalletPaymentFormProps> = ({
  onPaymentInitiated,
}) => {
  const [formData, setFormData] = useState<WalletPaymentData>({
    walletProvider: "Xtopay",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const isXtopay = formData.walletProvider === "Xtopay";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { phoneNumber } = formData;

    // Validate input
    if (isXtopay) {
      if (!/^\d{8}$/.test(phoneNumber)) {
        alert("Please enter a valid 8-digit Xtopay account number");
        setIsLoading(false);
        return;
      }
    } else {
      if (!/^0\d{9}$/.test(phoneNumber)) {
        alert("Please enter a valid 10-digit phone number starting with 0");
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onPaymentInitiated();
    setIsLoading(false);
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
        Wallet Payment
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid grid-cols-1 gap-4">
          {/* Wallet Provider */}
          <div>
            <label
              htmlFor="walletProvider"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Wallet Provider*
            </label>
            <div className="relative">
              {/* Left Logo */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Image
                  src={`/brands/${formData.walletProvider.toLowerCase()}.svg`}
                  alt={formData.walletProvider}
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>

              <select
                id="walletProvider"
                className="block w-full appearance-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 pr-10 text-sm text-gray-900 focus:border-[#513b7e] focus:ring-[#513b7e] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#513b7e] dark:focus:ring-[#513b7e]"
                value={formData.walletProvider}
                onChange={handleChange}
                required
              >
                <option value="Xtopay">Xtopay</option>
                <option value="hubtel">Hubtel</option>
                <option value="gmoney">GMoney</option>
                <option value="zeepay">Zeepay</option>
              </select>

              {/* Right Dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Phone/Account Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              {isXtopay ? "Xtopay Account Number*" : "Phone Number*"}
            </label>
            <div className="relative">
              {/* Left Icon */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>

              <input
                type="tel"
                id="phoneNumber"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-[#513b7e] focus:ring-[#513b7e] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-[#513b7e] dark:focus:ring-[#513b7e]"
                placeholder={isXtopay ? "e.g. 08012345" : "e.g. 0244123456"}
                value={formData.phoneNumber}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: isXtopay
                      ? cleaned.slice(0, 8)
                      : cleaned.slice(0, 10),
                  }));
                }}
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4 ${
            isLoading
              ? 'bg-[#513b7e] opacity-70 cursor-not-allowed'
              : 'bg-[#513b7e] hover:bg-[#3d2c5f] focus:ring-[#7e6b9e] dark:bg-[#513b7e] dark:hover:bg-[#3d2c5f] dark:focus:ring-[#7e6b9e]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Pay with Digital Wallet'
          )}
        </button>
      </form>
    </div>
  );
};

export default WalletPaymentForm;