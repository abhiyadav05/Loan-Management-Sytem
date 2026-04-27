import { Request, Response } from "express";
import Loan from "../models/Loan";

export const getSanctionedLoans = async (_req: Request, res: Response) => {
  const loans = await Loan.find({ status: "sanctioned" }).populate(
    "borrower",
    "-password",
  );
  res.json(loans);
};

export const disburseLoan = async (req: Request, res: Response) => {
  const loan = await Loan.findByIdAndUpdate(
    req.params.id,
    { status: "disbursed", disbursedAt: new Date() },
    { new: true },
  );
  res.json(loan);
};
