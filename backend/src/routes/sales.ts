import { Router } from "express";
import { getLeads, getAllBorrowers } from "../controllers/salesController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/leads", protect, authorize("sales", "admin"), getLeads);
router.get("/borrowers", protect, authorize("sales", "admin"), getAllBorrowers);

export default router;