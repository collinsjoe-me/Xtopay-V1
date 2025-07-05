import { Request, Response } from "express";
import { supabase } from "../supabaseClient";
import { randomUUID } from "crypto";

export async function checkoutInitiate(req: Request, res: Response) {
  const { amount, currency, clientReference, description, customer, channels, callbackUrl, returnUrl, cancelUrl, business_id, payeeName, payeePhone } = req.body;
  let customerId = null;
  // Support both customer object and payeeName/payeePhone
  const customerData = customer || (payeePhone ? { name: payeeName, phone: payeePhone } : null);
  if (customerData) {
    const { data: cust, error: custErr } = await supabase
      .from("customer")
      .upsert([{ phone: customerData.phone, name: customerData.name, email: customerData.email }], { onConflict: "phone" })
      .select("id")
      .single();
    if (custErr) return res.status(500).json({ status: "error", error: custErr.message });
    customerId = cust.id;
  }
  // Use UUID for checkoutId
  const checkoutId = `xtp_${randomUUID()}`;
  const { error: checkoutErr } = await supabase.from("checkout").insert([
    {
      checkout_id: checkoutId,
      business_id: business_id || "0800000",
      client_reference: clientReference,
      amount,
      currency,
      description,
      customer_id: customerId,
      channels,
      callback_url: callbackUrl,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      status: "pending",
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    },
  ]);
  if (checkoutErr) return res.status(500).json({ status: "error", error: checkoutErr.message });
  res.json({
    status: "pending",
    data: {
      checkoutId,
      checkoutUrl: `https://pay.xtopay.co/${checkoutId}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      clientReference,
    }
  });
}
