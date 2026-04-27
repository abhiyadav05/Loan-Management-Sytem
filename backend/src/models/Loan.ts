import mongoose, { Document, Schema } from "mongoose";

export type LoanStatus =
  | "applied"
  | "sanctioned"
  | "disbursed"
  | "closed"
  | "rejected";

export interface ILoan extends Document {
  borrower: mongoose.Types.ObjectId;
  amount: number;
  tenure: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  status: LoanStatus;
  rejectionReason?: string;
  disbursedAt?: Date;
  closedAt?: Date;
}

const LoanSchema = new Schema<ILoan>(
  {
    borrower: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    interestRate: { type: Number, default: 12 },
    simpleInterest: { type: Number, required: true },
    totalRepayment: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "applied",
        "sanctioned",
        "disbursed",
        "closed",
        "rejected"
      ],
      default: "applied",
    },
    rejectionReason: String,
    disbursedAt: Date,
    closedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model<ILoan>("Loan", LoanSchema);
