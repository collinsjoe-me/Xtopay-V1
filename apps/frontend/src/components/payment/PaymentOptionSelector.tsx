"use client";
import React, { useState, useEffect } from "react";
import CardPaymentForm from "./CardPaymentForm";
import MobileMoneyPaymentForm from "./MobileMoneyPaymentForm";
import WalletPaymentForm from "./WalletPaymentForm";
import OTPVerificationForm from "./OTPVerificationForm";
import StatusModal from "./StatusModal";
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

const PaymentOptionSelector: React.FC<PaymentOptionSelectorProps> = ({
  uuid,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: "success" as "success" | "failed" | "insufficient",
    title: "",
    description: "",
  });
  const [paymentDetails, setPaymentDetails] = useState<{
    amount: number;
    currency: string;
    businessName: string;
    businessEmail?: string;
    logoUrl?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Enhanced logging function
  const log = (message: string, data?: unknown) => {
    console.log(`[PaymentOptionSelector] ${message}`, data || '');
  };

  // Fetch payment details when component mounts
  useEffect(() => {
    if (!uuid) {
      log("No UUID provided, skipping payment details fetch");
      setLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        log("Starting payment details fetch", { uuid });
        setLoading(true);
        setError("");
        
        const res = await fetch(`${API_BASE}/checkout/details/${uuid}`);
        log("API response received", { status: res.status });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const responseData = await res.json();
        log("API response data", responseData);

        if (!responseData?.data) {
          throw new Error("Invalid response structure - missing data");
        }

        const { data } = responseData;
        
        // Validate required fields
        if (typeof data.amount === 'undefined' || !data.businessName) {
          throw new Error("Missing required payment details");
        }

        // Convert amount to number safely
        const amount = Number(data.amount);
        if (isNaN(amount)) {
          throw new Error("Invalid amount format");
        }

        const paymentData = {
          amount,
          currency: data.currency || "GHS",
          businessName: data.businessName,
          businessEmail: data.businessEmail,
          logoUrl: data.logoUrl
        };

        log("Processed payment details", paymentData);
        setPaymentDetails(paymentData);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        log("Error fetching payment details", { error: errorMessage });
        setError(errorMessage);
        setPaymentDetails(null);
      } finally {
        setLoading(false);
        log("Payment details fetch completed");
      }
    };

    fetchPaymentDetails();
  }, [uuid]);

  const handlePaymentInitiated = (method: PaymentMethod) => {
    log("Payment initiated", { method });
    if (method !== "card") {
      setShowOtp(true);
    } else {
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
    log("OTP completed");
    setShowOtp(false);
    setTimeout(() => {
      const status = Math.random() > 0.5 ? "success" : Math.random() > 0.5 ? "failed" : "insufficient";
      log("Setting payment status", { status });
      setModalState({
        isOpen: true,
        status,
        title: status === "success" 
          ? "Payment Successful" 
          : status === "failed" 
            ? "Verification Failed" 
            : "Insufficient Funds",
        description: status === "success"
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

  const PaymentDetailsDisplay = () => {
    log("Rendering PaymentDetailsDisplay", { loading, error, paymentDetails });

    if (loading) {
      return (
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      );
    }

    if (error || !paymentDetails) {
      return (
        <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">
            {error || "Failed to load payment details"}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          {paymentDetails.logoUrl ? (
            <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700 overflow-hidden">
              <Image
                src={paymentDetails.logoUrl}
                alt={paymentDetails.businessName}
                width={40}
                height={40}
                className="object-cover"
                onError={(e) => {
                  log("Failed to load logo image", { error: e });
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/default-business-logo.png';
                }}
              />
            </div>
          ) : (
            <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-300 text-lg">🏪</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {paymentDetails.businessName}
            </h3>
            {paymentDetails.businessEmail && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {paymentDetails.businessEmail}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount to pay:
          </span>
          <span className="text-lg font-bold text-[#4a3c78] dark:text-blue-400">
            {paymentDetails.currency} {paymentDetails.amount.toFixed(2)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="mx-auto max-w-md px-4 py-8 sm:py-12">
      <PaymentDetailsDisplay />

      {uuid && (
        <div className="space-y-6">
          {showOtp ? (
            <div className="space-y-6">
              <OTPVerificationForm
                onComplete={handleOtpComplete}
                onResend={() => {
                  log("Resending OTP");
                  // Implement OTP resend logic here
                }}
              />
            </div>
          ) : !selectedMethod ? (
            <div className="space-y-3 py-2.5">
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
                  onClick={() => {
                    log("Payment method selected", { method: option.method });
                    setSelectedMethod(option.method as PaymentMethod);
                  }}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3.5 transition-colors hover:border-[#513b7e] hover:bg-[#f5f2fa] dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#7e6b9e]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-[#f5f2fa] p-2 dark:bg-[#3d2c5f]`}>
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
                          onError={(e) => {
                            log("Failed to load brand logo", { brand, error: e });
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/default-brand-logo.svg';
                          }}
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
                onClick={() => {
                  log("Back to payment methods clicked");
                  setSelectedMethod(null);
                }}
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
        onClose={() => {
          log("Status modal closed", { status: modalState.status });
          setModalState((prev) => ({ ...prev, isOpen: false }));
        }}
        onAction={() => {
          log("Status modal action triggered", { status: modalState.status });
          if (modalState.status === "failed") {
            setShowOtp(true);
          }
        }}
      />

      <ReportProblemModal
        isOpen={showReportModal}
        onClose={() => {
          log("Report problem modal closed");
          setShowReportModal(false);
        }}
      />
    </section>
  );
};

export default PaymentOptionSelector;