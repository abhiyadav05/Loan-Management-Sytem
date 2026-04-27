import mongoose, { Document, Schema } from "mongoose";

export type Role =
  | "admin"
  | "sales"
  | "sanction"
  | "disbursement"
  | "collection"
  | "borrower";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  personalDetails?: {
    pan: string;
    dateOfBirth: string;
    monthlySalary: number;
    employmentMode: "employed" | "unemployed";
  };
  breCleared: boolean;
  salarySlipPath?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "admin",
        "sales",
        "sanction",
        "disbursement",
        "collection",
        "borrower",
      ],
      default: "borrower",
    },
    personalDetails: {
      pan: String,
      dateOfBirth: String,
      monthlySalary: Number,
      employmentMode: String,
    },
    breCleared: { type: Boolean, default: false },
    salarySlipPath: String,
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
