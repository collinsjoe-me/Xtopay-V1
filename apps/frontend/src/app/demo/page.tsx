"use client";
import React, { useState } from "react";

const IntegrationDemoPage: React.FC = () => {
  const [form, setForm] = useState({
    amount: "",
    name: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-4">
        {error && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <h1 className="text-xl font-bold text-center">Payment Integration Demo</h1>
          
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