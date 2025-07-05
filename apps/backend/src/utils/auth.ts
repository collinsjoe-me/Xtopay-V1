import { Request } from "express";

export function parseBasicAuth(req: Request) {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Basic ")) return null;
  const base64 = auth.replace("Basic ", "");
  try {
    const decoded = Buffer.from(base64, "base64").toString();
    const [api_id, api_key] = decoded.split(":");
    if (!api_id || !api_key) return null;
    return { api_id, api_key };
  } catch {
    return null;
  }
}
