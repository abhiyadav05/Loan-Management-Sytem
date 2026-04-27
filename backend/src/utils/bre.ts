interface BREInput {
  dateOfBirth: string;
  monthlySalary: number;
  pan: string;
  employmentMode: string;
}

interface BREResult {
  passed: boolean;
  reason?: string;
}

export const runBRE = (data: BREInput): BREResult => {
  const dob = new Date(data.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

  if (age < 23 || age > 50) {
    return { passed: false, reason: "Age must be between 23 and 50 years." };
  }

  if (data.monthlySalary < 25000) {
    return {
      passed: false,
      reason: "Monthly salary must be at least ₹25,000.",
    };
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(data.pan)) {
    return { passed: false, reason: "PAN number format is invalid." };
  }

  if (data.employmentMode === "unemployed") {
    return { passed: false, reason: "Unemployed applicants are not eligible." };
  }

  return { passed: true };
};
