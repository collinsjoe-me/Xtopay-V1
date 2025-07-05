"use client";
import React, { useState } from "react";
import CardPaymentForm from "./CardPaymentForm";
import MobileMoneyPaymentForm from "./MobileMoneyPaymentForm";
import WalletPaymentForm from "./WalletPaymentForm";
import OTPVerificationForm from "./OTPVerificationForm";
import StatusModal from "./StatusModal";
import PaymentDetails from "./PaymentDetails";
import {
  Lock,
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Smartphone,
  Wallet,
  HandCoins,
} from "lucide-react";
import Image from "next/image";
import { ReportProblemModal } from "./ReportProblemModal";
import Link from "next/link";

type PaymentMethod = "card" | "mobileMoney" | "wallet";

interface PaymentOptionSelectorProps {
  cancelUrl?: string;
  uuid?: string;
}

type PaymentData = {
  amount: number;
  currency: string;
  merchantName: string;
  merchantEmail: string;
  phoneNumber: string;
  name?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api/";

interface BusinessInfo {
  logoUrl: string;
  businessName: string;
  businessEmail: string;
  // Add other fields as needed
}

const PaymentOptionSelector: React.FC<PaymentOptionSelectorProps> = ({
  uuid,
}) => {
  const [businessInfo, setBusinessInfo] = React.useState<BusinessInfo | null>(null);
  const [paymentData, setPaymentData] = React.useState<PaymentData | null>(
    null
  );
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [showOtp, setShowOtp] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: "success" as "success" | "failed" | "insufficient",
    title: "",
    description: "",
  });
  // Use uuid prop directly for payment session

  // Fetch business info on mount (only if not in uuid/checkout mode)
  React.useEffect(() => {
    if (uuid) return; // Don't fetch business info if uuid is present

    fetch(`${API_BASE}/business/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("demo_id:demo_key")}`,
      },
      body: JSON.stringify({ business_id: "0800000" }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Business not found")))
      .then((data) => {
        setBusinessInfo(data.data);
    
      })
      .catch(() => {
        setBusinessInfo(null);
      });
  }, [uuid]);

  // Fetch payment details and business info when uuid changes
  React.useEffect(() => {
    if (!uuid) return;
    setLoadError(null);
    fetch(`${API_BASE}/checkout/status/${uuid}`, {
      headers: {
        Authorization: `Basic ${btoa("api_merchant1:key_merchant1")}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject("Not found")))
      .then((data) => {
        setPaymentData({
          amount: data.data.amount,
          currency: data.data.currency || "GHS",
          merchantName: data.data.merchantName || "Demo Merchant",
          merchantEmail: data.data.merchantEmail || "merchant@example.com",
          phoneNumber: data.data.customerPhone || "",
          name: data.data.payeeName || "",
        });
        // Fetch business info for this payment if not already loaded
        if (!businessInfo && data.data.businessId) {
          fetch(`${API_BASE}/business/info`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa("demo_id:demo_key")}`,
            },
            body: JSON.stringify({ business_id: data.data.businessId }),
          })
            .then((res) => (res.ok ? res.json() : Promise.reject("Business not found")))
            .then((biz) => setBusinessInfo(biz.data))
            .catch(() => setBusinessInfo(null));
        }
      })
      .catch(() => {
        setPaymentData(null);
        setLoadError("Payment not found or expired.");
      });
  }, [uuid, businessInfo]);

  const handlePaymentInitiated = (method: PaymentMethod) => {
    // Only show OTP for mobile money and wallet payments
    if (method !== "card") {
      setShowOtp(true);
    } else {
      // For card payments, directly show success
      setTimeout(() => {
        setModalState({
          isOpen: true,
          status: "success",
          title: "Payment Successful",
          description: "Your card payment has been processed successfully.",
        });
      }, 1500);
    }
  };

  const handleOtpComplete = () => {
    setShowOtp(false);
    setTimeout(() => {
      const status =
        Math.random() > 0.5
          ? "success"
          : Math.random() > 0.5
            ? "failed"
            : "insufficient";
      setModalState({
        isOpen: true,
        status,
        title:
          status === "success"
            ? "Payment Successful"
            : status === "failed"
              ? "Verification Failed"
              : "Insufficient Funds",
        description:
          status === "success"
            ? "Your payment has been verified and completed successfully."
            : status === "failed"
              ? "The code you entered is invalid. Please try again."
              : "You don't have enough funds to complete this transaction.",
      });
    }, 1500);
  };

  const SecurityBadge = () => (
    <div className="flex justify-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 shadow-sm dark:border-gray-600 dark:text-gray-300">
        <Lock className="h-4 w-4 text-green-500" strokeWidth={2} />
        <span>
          Secured by{" "}
          <Link
            href="https://xtopay.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#513b7e] hover:underline dark:text-[#7e6b9e]"
          >
            Xtopay
          </Link>
        </span>
      </div>
    </div>
  );

  return (
    <section className="mx-auto max-w-md px-4 py-8 sm:py-12">
   
      {/* Show payment details and payment options immediately if initiatedUuid is set */}
      {uuid && (
        <div className="space-y-6">
          {loadError ? (
            <div className="text-center text-red-500 dark:text-red-400">
              {loadError}
            </div>
          ) : paymentData ? (
            <>
              <PaymentDetails
                amount={paymentData.amount}
                currency={paymentData.currency}
                merchantName={businessInfo?.businessName || paymentData.merchantName}
                merchantLogo={businessInfo?.logoUrl || "/merchant/favicon.png"}
                merchantEmail={businessInfo?.businessEmail || paymentData.merchantEmail}
                phoneNumber={paymentData.phoneNumber}
              />
              {/* Payer name intentionally not displayed */}
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Loading payment details...
            </div>
          )}

          {showOtp ? (
            <div className="space-y-6">
              <OTPVerificationForm
                onComplete={handleOtpComplete}
                onResend={() => console.log("Resending OTP...")}
              />
            </div>
          ) : !selectedMethod ? (
            <div className="space-y-3">
              {[
                {
                  method: "mobileMoney",
                  title: "Mobile Money",
                  icon: <Smartphone className="h-5 w-5 text-yellow-500" />,
                  brands: ["momo", "telecel", "at"],
                  color: "yellow",
                },
                {
                  method: "card",
                  title: "Bank Card",
                  icon: <CreditCard className="h-5 w-5 text-blue-500" />,
                  brands: ["visa", "mastercard", "verve"],
                  color: "blue",
                },
                {
                  method: "wallet",
                  title: "Wallet",
                  icon: <Wallet className="h-5 w-5 text-emerald-500" />,
                  brands: ["xtopay", "hubtel", "gmoney", "zeepay"],
                  color: "emerald",
                },
                {
                  method: "bnpl",
                  title: "Pay Later",
                  icon: <HandCoins className="h-5 w-5 text-purple-500" />,
                  brands: ["xtopay"],
                  color: "purple",
                },
              ].map((option) => (
                <button
                  key={option.method}
                  onClick={() =>
                    setSelectedMethod(option.method as PaymentMethod)
                  }
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3.5 transition-colors hover:border-[#513b7e] hover:bg-[#f5f2fa] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#7e6b9e]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg bg-[#f5f2fa] p-2 dark:bg-[#3d2c5f]`}
                    >
                      {option.icon}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {option.brands.map((brand) => (
                        <Image
                          key={brand}
                          src={`/brands/${brand}.svg`}
                          alt={brand}
                          width={24}
                          height={16}
                          className="h-4 w-6 object-contain"
                        />
                      ))}
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedMethod(null)}
                className="flex items-center text-sm font-medium text-[#513b7e] hover:text-[#3d2c5f] dark:text-[#7e6b9e]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to payment methods
              </button>

              {selectedMethod === "card" && (
                <CardPaymentForm
                  onPaymentInitiated={() => handlePaymentInitiated("card")}
                />
              )}
              {selectedMethod === "mobileMoney" && (
                <MobileMoneyPaymentForm
                  onPaymentInitiated={() => handlePaymentInitiated("mobileMoney")}
                />
              )}
              {selectedMethod === "wallet" && (
                <WalletPaymentForm
                  onPaymentInitiated={() => handlePaymentInitiated("wallet")}
                />
              )}
            </div>
          )}

          <SecurityBadge />
        </div>
      )}

      <StatusModal
        isOpen={modalState.isOpen}
        status={modalState.status}
        title={modalState.title}
        description={modalState.description}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onAction={() => modalState.status === "failed" && setShowOtp(true)}
      />

      <ReportProblemModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </section>
  );
};

export default PaymentOptionSelector;
