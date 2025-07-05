import { Request, Response } from "express";
import { supabase } from "../supabaseClient";
import { parseBasicAuth } from "../utils/auth";

export async function businessInfo(req: Request, res: Response) {
  // Require POST for security
  if (req.method !== "POST") return res.status(405).json({ status: "error", error: "Method Not Allowed" });

  // Parse and validate Basic Auth
  const creds = parseBasicAuth(req);
  if (!creds) return res.status(401).json({ status: "error", error: "Missing or invalid Authorization header" });

  // Find business by business_id and check api_id/api_key
  const { business_id } = req.body;
  // Add logs for debugging
  // eslint-disable-next-line no-console
  console.log("business_id:", business_id);
  // eslint-disable-next-line no-console
  console.log("creds:", creds);
  const { data, error } = await supabase
    .from("business")
    .select("name,email,business_id,currency,logo_url,api_id,api_key")
    .eq("business_id", business_id)
    .single();
  // eslint-disable-next-line no-console
  console.log("supabase data:", data, "error:", error);
  if (error || !data) return res.status(404).json({ status: "error", error: "Business not found" });
  if (data.api_id !== creds.api_id || data.api_key !== creds.api_key) {
    return res.status(403).json({ status: "error", error: "Invalid credentials" });
  }
  // Map to API spec keys and remove sensitive fields
  const mapped = {
    businessName: data.name,
    businessEmail: data.email,
    businessId: data.business_id,
    currency: data.currency,
    logoUrl: data.logo_url
  };
  res.json({ status: "success", data: mapped });
}
