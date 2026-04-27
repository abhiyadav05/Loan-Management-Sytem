import { Router } from "express";
import { getAppliedLoans, sanctionLoan, rejectLoan } from "../controllers/sanctionController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/loans", protect, authorize("sanction", "admin"), getAppliedLoans);
router.put("/loans/:id/sanction", protect, authorize("sanction", "admin"), sanctionLoan);
router.put("/loans/:id/reject", protect, authorize("sanction", "admin"), rejectLoan);

export default router;