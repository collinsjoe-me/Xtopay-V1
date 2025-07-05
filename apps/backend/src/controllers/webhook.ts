import { Request, Response } from "express";

export async function webhook(req: Request, res: Response) {
  // For demo, just acknowledge
  res.status(200).json({ received: true });
}
