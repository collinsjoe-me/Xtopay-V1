import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export async function checkoutCancel(req: Request, res: Response) {
  const { clientReference } = req.params;
  const { error } = await supabase
    .from("checkout")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("client_reference", clientReference);
  if (error) return res.status(500).json({ status: "error", error: error.message });
  res.json({ status: "cancelled", cancelledAt: new Date().toISOString() });
}
