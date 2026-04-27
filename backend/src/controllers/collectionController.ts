import { Request, Response } from "express";
import Loan from "../models/Loan";
import Payment from "../models/Payment";

export const getDisbursedLoans = async (_req: Request, res: Response) => {
  const loans = await Loan.find({ status: "disbursed" }).populate(
    "borrower",
    "-password",
  );
  res.json(loans);
};

export const recordPayment = async (req: Request, res: Response) => {
  const { utrNumber, amount, paymentDate } = req.body;
  const loan = await Loan.findById(req.params.id);
  if (!loan) {
    res.status(404).json({ message: "Loan not found" });
    return;
  }
  const existingUTR = await Payment.findOne({ utrNumber });
  if (existingUTR) {
    res.status(400).json({ message: "UTR number already used" });
    return;
  }
  const payments = await Payment.find({ loan: loan._id });
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = loan.totalRepayment - totalPaid;
  if (Number(amount) > remaining) {
    res
      .status(400)
      .json({
        message: `Payment exceeds outstanding balance of ₹${remaining.toFixed(2)}`,
      });
    return;
  }
  const payment = await Payment.create({
    loan: loan._id,
    utrNumber,
    amount: Number(amount),
    paymentDate,
  });
  const newTotalPaid = totalPaid + Number(amount);
  if (newTotalPaid >= loan.totalRepayment) {
    await Loan.findByIdAndUpdate(loan._id, {
      status: "closed",
      closedAt: new Date(),
    });
  }
  res.status(201).json(payment);
};

export const getLoanPayments = async (req: Request, res: Response) => {
  const payments = await Payment.find({ loan: req.params.id });
  res.json(payments);
};
