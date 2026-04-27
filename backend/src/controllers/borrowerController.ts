import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import Loan from "../models/Loan";
import { runBRE } from "../utils/bre";

export const submitPersonalDetails = async (req: AuthRequest, res: Response) => {
  const { pan, dateOfBirth, monthlySalary, employmentMode } = req.body;
  const breResult = runBRE({ pan, dateOfBirth, monthlySalary: Number(monthlySalary), employmentMode });
  if (!breResult.passed) {
    res.status(400).json({ message: breResult.reason });
    return;
  }
  await User.findByIdAndUpdate(req.user?.id, {
    personalDetails: { pan, dateOfBirth, monthlySalary: Number(monthlySalary), employmentMode },
    breCleared: true,
  });
  res.json({ message: "Personal details saved", breCleared: true });
};

export const uploadSalarySlip = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }
  await User.findByIdAndUpdate(req.user?.id, { salarySlipPath: req.file.path });
  res.json({ message: "Salary slip uploaded", path: req.file.path });
};

export const applyLoan = async (req: AuthRequest, res: Response) => {
  const { amount, tenure } = req.body;
  const user = await User.findById(req.user?.id);
  if (!user?.breCleared) {
    res.status(400).json({ message: "BRE not cleared" });
    return;
  }
  if (!user.salarySlipPath) {
    res.status(400).json({ message: "Salary slip not uploaded" });
    return;
  }
  const P = Number(amount);
  const T = Number(tenure);
  const R = 12;
  const si = (P * R * T) / (365 * 100);
  const totalRepayment = P + si;
  const loan = await Loan.create({
    borrower: req.user?.id,
    amount: P,
    tenure: T,
    interestRate: R,
    simpleInterest: si,
    totalRepayment,
    status: "applied",
  });
  res.status(201).json(loan);
};

export const getLoanStatus = async (req: AuthRequest, res: Response) => {
  const loan = await Loan.findOne({ borrower: req.user?.id }).sort({ createdAt: -1 });
  res.json(loan);
};