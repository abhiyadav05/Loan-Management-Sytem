export type Role = "admin" | "sales" | "sanction" | "disbursement" | "collection" | "borrower";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  breCleared?: boolean;
  salarySlipPath?: string;
  personalDetails?: {
    pan: string;
    dateOfBirth: string;
    monthlySalary: number;
    employmentMode: string;
  };
}

export interface Loan {
  _id: string;
  borrower: User | string;
  amount: number;
  tenure: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  status: "applied" | "sanctioned" | "disbursed" | "closed" | "rejected";
  rejectionReason?: string;
  disbursedAt?: string;
  closedAt?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  loan: string;
  utrNumber: string;
  amount: number;
  paymentDate: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}