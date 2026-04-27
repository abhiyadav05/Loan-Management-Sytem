import { Router } from "express";
import { getDisbursedLoans, recordPayment, getLoanPayments } from "../controllers/collectionController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/loans", protect, authorize("collection", "admin"), getDisbursedLoans);
router.post("/loans/:id/payment", protect, authorize("collection", "admin"), recordPayment);
router.get("/loans/:id/payments", protect, authorize("collection", "admin"), getLoanPayments);

export default router;