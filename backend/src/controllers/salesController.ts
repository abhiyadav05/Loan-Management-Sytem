import { Request, Response } from "express";
import User from "../models/User";

export const getLeads = async (_req: Request, res: Response) => {
  const leads = await User.find({ role: "borrower", breCleared: false }).select(
    "-password",
  );
  res.json(leads);
};

export const getAllBorrowers = async (_req: Request, res: Response) => {
  const borrowers = await User.find({ role: "borrower" }).select("-password");
  res.json(borrowers);
};
