import { Router } from "express";
import { businessInfo } from "./controllers/businessInfo";
import { checkoutInitiate } from "./controllers/checkoutInitiate";
import { checkoutStatus } from "./controllers/checkoutStatus";
import { webhook } from "./controllers/webhook";
import { checkoutCancel } from "./controllers/checkoutCancel";

const router = Router();

router.post("/business/info", businessInfo);
router.post("/checkout/initiate", checkoutInitiate);
router.get("/checkout/status/:clientReference", checkoutStatus);
router.post("/webhook", webhook);
router.post("/checkout/cancel/:clientReference", checkoutCancel);

export default router;
