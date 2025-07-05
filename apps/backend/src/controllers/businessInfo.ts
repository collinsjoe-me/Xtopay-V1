import { Request, Response } from "express";
import { supabase } from "../supabaseClient";
import { parseBasicAuth } from "../utils/auth";

export async function businessInfo(req: Request, res: Response) {
  try {
    // Require POST for security
    if (req.method !== "POST") {
      return res.status(405).json({ 
        status: "error", 
        error: "Method Not Allowed" 
      });
    }

    // Parse and validate Basic Auth
    const creds = parseBasicAuth(req);
    if (!creds) {
      return res.status(401).json({ 
        status: "error", 
        error: "Missing or invalid Authorization header" 
      });
    }

    const { business_id } = req.body;
    if (!business_id) {
      return res.status(400).json({ 
        status: "error", 
        error: "business_id is required" 
      });
    }

    // Fetch business info
    const { data, error } = await supabase
      .from("business")
      .select("name, email, business_id, currency, logo_url, api_id, api_key")
      .eq("business_id", business_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ 
        status: "error", 
        error: "Business not found" 
      });
    }

    // Validate credentials
    if (data.api_id !== creds.api_id || data.api_key !== creds.api_key) {
      return res.status(403).json({ 
        status: "error", 
        error: "Invalid credentials" 
      });
    }

    // Return sanitized business info
    res.json({
      status: "success",
      data: {
        businessName: data.name,
        businessEmail: data.email,
        businessId: data.business_id,
        currency: data.currency,
        logoUrl: data.logo_url,
        apiId: data.api_id, // Only returned for verification purposes
      },
    });
  } catch (error) {
    console.error("Business info error:", error);
    res.status(500).json({ 
      status: "error", 
      error: "Internal server error" 
    });
  }
}