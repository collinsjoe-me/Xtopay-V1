"use client";
import React, { useState } from "react";
//import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";
const BUSINESS_ID = "0800000"; // Use the correct test merchant id
const API_ID = "demo_id";
const API_KEY = "demo_key";

const IntegrationDemoPage: React.FC = () => {
  const [form, setForm] = useState({
    amount: "20.00",
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
    setLoading(true);
    setError("");
    try {
      // Call the real backend API to create a payment and get a checkoutUrl
      const res = await fetch(`${API_BASE}/checkout/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${API_ID}:${API_KEY}`)}`,
        },
        body: JSON.stringify({
          business_id: BUSINESS_ID,
          amount: parseFloat(form.amount),
          currency: "GHS",
          description: "Integration Demo Payment",
          customer: {
            name: form.name,
            phone: form.phoneNumber,
            email: ""
          },
          channels: ["mtn", "card"],
          callbackUrl: "https://merchant.com/callback",
          returnUrl: "https://merchant.com/thank-you",
          cancelUrl: "https://merchant.com/cancelled",
          clientReference: `DEMO-${Date.now()}`
        }),
      });
      if (!res.ok) throw new Error("Failed to create payment");
      const data = await res.json();
      // Redirect to /[checkoutId] for local testing
      let checkoutUrl = data.data?.checkoutUrl;
      if (checkoutUrl && checkoutUrl.startsWith("https://pay.xtopay.co/")) {
        checkoutUrl = "/" + checkoutUrl.replace("https://pay.xtopay.co/", "");
      }
      if (!data.data?.checkoutUrl) throw new Error("No checkoutUrl returned");
      window.location.href = checkoutUrl || data.data.checkoutUrl;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold mb-2 text-center">Xtopay Integration Demo</h1>
        <input
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full rounded border px-3 py-2"
          required
        />
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full rounded border px-3 py-2"
          required
        />
        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full rounded border px-3 py-2"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#513b7e] text-white rounded py-2 font-semibold hover:bg-[#3e2e61] transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default IntegrationDemoPage;
