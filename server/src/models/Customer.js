import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    address: { type: String, default: "" },
    industry: { type: String, default: "" },
    revenue: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Churned"],
      default: "Active",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

customerSchema.index({ name: "text", email: "text", company: "text" });

export default mongoose.model("Customer", customerSchema);
