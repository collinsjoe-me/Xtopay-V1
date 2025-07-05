import { Request, Response } from "express";
import { supabase } from "../supabaseClient";

export async function checkoutDetails(req: Request, res: Response) {
  try {
    const { uuid } = req.params;

    // Fetch checkout details
    const { data: checkout, error: checkoutError } = await supabase
      .from("checkout")
      .select("amount, currency, business_id")
      .eq("checkout_id", uuid)
      .single();

    if (checkoutError || !checkout) {
      return res.status(404).json({
        status: "error",
        error: "Checkout not found",
      });
    }

    // Fetch business details
    const { data: business, error: businessError } = await supabase
      .from("business")
      .select("name, email, logo_url")
      .eq("business_id", checkout.business_id)
      .single();

    if (businessError || !business) {
      return res.status(404).json({
        status: "error",
        error: "Business not found",
      });
    }

    res.json({
      status: "success",
      data: {
        amount: checkout.amount,
        currency: checkout.currency,
        businessName: business.name,
        businessEmail: business.email,
        logoUrl: business.logo_url,
      },
    });
  } catch (error) {
    console.error("Error fetching checkout details:", error);
    res.status(500).json({
      status: "error",
      error: "Internal server error",
    });
  }
}