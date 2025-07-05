import React from "react";
import Image from "next/image";

interface PaymentDetailsProps {
  amount: number;
  currency?: string;
  businessId?: string; // Always required for fetching business info
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api/";

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  amount,
  currency = "GHS",
  businessId,
}) => {
  const [businessInfo, setBusinessInfo] = React.useState<{
    logoUrl?: string;
    businessName?: string;
    businessEmail?: string;
  } | null>(null);

  React.useEffect(() => {
    if (!businessId) return;
    fetch(`${API_BASE}/business/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("demo_id:demo_key")}`,
      },
      body: JSON.stringify({ business_id: businessId }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Business not found")))
      .then((data) => setBusinessInfo(data.data))
      .catch(() => setBusinessInfo(null));
  }, [businessId]);

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-lg border border-gray-200 bg-[#fff4cc] dark:border-gray-700 dark:bg-gray-800">
      {/* Business Info Row */}
      <div className="flex items-center gap-3 sm:gap-4">
        {businessInfo?.logoUrl && (
          <div className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700">
            <Image
              src={businessInfo.logoUrl}
              alt={businessInfo.businessName || "Business"}
              width={40}
              height={40}
              className="rounded-full object-contain"
              priority
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
            {businessInfo?.businessName || businessId}
          </h3>
          {businessInfo?.businessEmail && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {businessInfo.businessEmail}
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
