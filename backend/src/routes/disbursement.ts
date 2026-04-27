import { Router } from "express";
import { getSanctionedLoans, disburseLoan } from "../controllers/disbursementController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/loans", protect, authorize("disbursement", "admin"), getSanctionedLoans);
router.put("/loans/:id/disburse", protect, authorize("disbursement", "admin"), disburseLoan);

export default router;