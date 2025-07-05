import { Router } from "express";
import { businessInfo } from "./controllers/businessInfo";
import { checkoutInitiate } from "./controllers/checkoutInitiate";
import { checkoutDetails } from "./controllers/checkoutDetails";

const router = Router();

router.post("/business/info", businessInfo);
router.post("/checkout/initiate", checkoutInitiate);
router.get("/checkout/details/:uuid", checkoutDetails);

export default router;
