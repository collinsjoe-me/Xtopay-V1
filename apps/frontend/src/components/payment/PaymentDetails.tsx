import React from "react";
import Image from "next/image";

interface PaymentDetailsProps {
  amount: number;
  currency?: string;
  merchantName: string;
  merchantLogo?: string;
  merchantEmail?: string;
  phoneNumber?: string;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  amount,
  currency = "GHS",
  merchantName,
  merchantLogo,
  merchantEmail,
  // phoneNumber,
}) => {


  
  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-lg border border-gray-200 bg-[#fff4cc] dark:border-gray-700 dark:bg-gray-800">
      {/* Merchant Info Row */}
      <div className="flex items-center gap-3 sm:gap-4">
        {merchantLogo && (
          <div className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700">
            <Image
              src={merchantLogo}
              alt={merchantName}
              width={40}
              height={40}
              className="rounded-full object-contain"
              priority
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
            {merchantName}
          </h3>
          {merchantEmail && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {merchantEmail}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mt-1 mb-0.5"></div>

      {/* Amount Info */}
      <div className="flex justify-between items-center text-xs font-semibold text-gray-700 dark:text-gray-300">
        <span>Amount to pay</span>
        <span className="text-[#4a3c78] dark:text-blue-400">
          {currency}{" "}
          {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};

export default PaymentDetails;
