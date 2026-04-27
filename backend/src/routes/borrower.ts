import { Router } from "express";
import multer from "multer";
import path from "path";
import { submitPersonalDetails, uploadSalarySlip, applyLoan, getLoanStatus } from "../controllers/borrowerController";
import { protect } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".pdf", ".jpg", ".jpeg", ".png"].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const router = Router();

router.post("/personal-details", protect, authorize("borrower"), submitPersonalDetails);
router.post("/upload-salary", protect, authorize("borrower"), upload.single("salarySlip"), uploadSalarySlip);
router.post("/apply", protect, authorize("borrower"), applyLoan);
router.get("/loan-status", protect, authorize("borrower"), getLoanStatus);

export default router;