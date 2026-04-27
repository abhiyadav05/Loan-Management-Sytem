import { Request, Response } from "express";
import Loan from "../models/Loan";

export const getAppliedLoans = async (_req: Request, res: Response) => {
  const loans = await Loan.find({ status: "applied" }).populate(
    "borrower",
    "-password",
  );
  res.json(loans);
};

export const sanctionLoan = async (req: Request, res: Response) => {
  const loan = await Loan.findByIdAndUpdate(
    req.params.id,
    { status: "sanctioned" },
    { new: true },
  );
  res.json(loan);
};

export const rejectLoan = async (req: Request, res: Response) => {
  const { reason } = req.body;
  const loan = await Loan.findByIdAndUpdate(
    req.params.id,
    { status: "rejected", rejectionReason: reason },
    { new: true },
  );
  res.json(loan);
};
