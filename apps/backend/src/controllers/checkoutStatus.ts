import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export async function checkoutStatus(req: Request, res: Response) {
  const { clientReference } = req.params;
  const { data: checkout, error } = await supabase
    .from("checkout")
    .select("*, payment:payment(*)")
    .eq("client_reference", clientReference)
    .single();
  if (error || !checkout) return res.status(404).json({ status: "not_found" });
  const payment = checkout.payment?.[0];
  res.json({
    status: payment ? "paid" : checkout.status,
    amount: checkout.amount,
    currency: checkout.currency,
    paidAt: payment?.paid_at,
    channel: payment?.channel,
    transactionId: payment?.transaction_id,
    customerPhone: payment?.customer_phone,
    fees: payment?.fees,
    settlementAmount: payment?.settlement_amount,
  });
}
