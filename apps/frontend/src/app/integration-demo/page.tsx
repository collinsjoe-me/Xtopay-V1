"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const IntegrationDemoPage: React.FC = () => {
  const [form, setForm] = useState({
    amount: "",
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [businessInfo, setBusinessInfo] = useState<{
    logoUrl?: string;
    businessName?: string;
    businessEmail?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch business info when component mounts
  useEffect(() => {
    const fetchBusinessInfo = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/business/info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_DEFAULT_API_ID}:${process.env.NEXT_PUBLIC_DEFAULT_API_KEY}`)}`,
          },
          body: JSON.stringify({ 
            business_id: process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID 
          }),
        });
        
        if (!res.ok) throw new Error("Failed to fetch business info");
        const data = await res.json();
        setBusinessInfo(data.data);
      } catch (err) {
        console.error("Error fetching business info:", err);
        setBusinessInfo(null);
      }
    };

    fetchBusinessInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate amount
    if (!form.amount || isNaN(parseFloat(form.amount))) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/checkout/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${process.env.NEXT_PUBLIC_DEFAULT_API_ID}:${process.env.NEXT_PUBLIC_DEFAULT_API_KEY}`)}`,
        },
        body: JSON.stringify({
          business_id: process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID,
          amount: parseFloat(form.amount),
          currency: "GHS",
          description: "Payment for services",
          customer: {
            name: form.name,
            phone: form.phoneNumber,
            email: ""
          },
          channels: ["mtn", "card"],
          callbackUrl: `${window.location.origin}/callback`,
          returnUrl: `${window.location.origin}/thank-you`,
          cancelUrl: `${window.location.origin}/cancel`,
          clientReference: `DEMO-${Date.now()}`
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create payment");
      }

      const data = await res.json();
      if (!data.data?.checkoutUrl) throw new Error("No checkout URL returned");

      // Redirect to checkout
      window.location.href = data.data.checkoutUrl;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const PaymentDetailsDisplay = () => {
    if (!form.amount) return null;

    return (
      <div className="flex flex-col gap-3 p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 mb-4">
        <div className="flex items-center gap-3">
          {businessInfo?.logoUrl ? (
            <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700 overflow-hidden">
              <Image
                src={businessInfo.logoUrl}
                alt={businessInfo.businessName || "Business logo"}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-300 text-lg">🏪</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {businessInfo?.businessName || "Demo Business"}
            </h3>
            {businessInfo?.businessEmail && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {businessInfo.businessEmail}
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
            GHS {parseFloat(form.amount).toFixed(2)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <PaymentDetailsDisplay />

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <h1 className="text-xl font-bold text-center">Payment Details</h1>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (GHS)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="0244123456"
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#513b7e] text-white rounded py-2 font-semibold hover:bg-[#3e2e61] transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IntegrationDemoPage;