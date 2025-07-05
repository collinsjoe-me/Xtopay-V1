import { Request, Response } from "express";
import { supabase } from "../supabaseClient";
import { randomUUID } from "crypto";

export async function checkoutInitiate(req: Request, res: Response) {
  try {
    const {
      amount,
      currency = "GHS",
      clientReference,
      description,
      customer,
      channels = ["mtn", "card"],
      callbackUrl,
      returnUrl,
      cancelUrl,
      business_id,
    } = req.body;

    // Validate required fields
    if (!amount || !business_id) {
      return res.status(400).json({
        status: "error",
        error: "Amount and business_id are required",
      });
    }

    // Validate amount is a positive number
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        status: "error",
        error: "Amount must be a positive number",
      });
    }

    // Process customer data
    let customerId = null;
    if (customer?.phone) {
      const { data: cust, error: custErr } = await supabase
        .from("customer")
        .upsert(
          {
            phone: customer.phone,
            name: customer.name || null,
            email: customer.email || null,
          },
          { onConflict: "phone" }
        )
        .select("id")
        .single();

      if (custErr) throw custErr;
      customerId = cust.id;
    }

    // Create checkout record
    const checkoutId = `xtp_${randomUUID()}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

    const { error: checkoutErr } = await supabase.from("checkout").insert([
      {
        checkout_id: checkoutId,
        business_id,
        client_reference: clientReference || `CHECKOUT-${Date.now()}`,
        amount: parseFloat(amount),
        currency,
        description: description || "Payment checkout",
        customer_id: customerId,
        channels,
        callback_url: callbackUrl,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      },
    ]);

    if (checkoutErr) throw checkoutErr;

    res.json({
      status: "success",
      data: {
        checkoutId,
        checkoutUrl: `${process.env.CHECKOUT_BASE_URL || "https://pay.xtopay.co"}/${checkoutId}`,
        expiresAt: expiresAt.toISOString(),
        clientReference,
        amount: parseFloat(amount),
        currency,
      },
    });
  } catch (error) {
    console.error("Checkout initiation error:", error);
    res.status(500).json({
      status: "error",
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}