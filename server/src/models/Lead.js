import mongoose from "mongoose";

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal",
  "Won",
  "Lost",
];

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    source: { type: String, default: "Website" },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      default: "New",
      index: true,
    },
    value: { type: Number, default: 0 },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

leadSchema.index({ name: "text", email: "text", company: "text" });

export default mongoose.model("Lead", leadSchema);
