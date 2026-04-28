import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "./config/db";
import User from "./models/User";

dotenv.config();

const seed = async () => {
  await connectDB();

  await User.deleteMany({ role: { $ne: "borrower" } });

  const roles = ["admin", "sales", "sanction", "disbursement", "collection"];
  const password = await bcrypt.hash("Password@123", 10);

  for (const role of roles) {
    await User.create({ name: role.charAt(0).toUpperCase() + role.slice(1), email: `${role}@lms.com`, password, role });
  }

  console.log("Seeded users:");
  roles.forEach((r) => console.log(`  ${r}@lms.com  /  Password@123`));
  mongoose.disconnect();
};

seed();