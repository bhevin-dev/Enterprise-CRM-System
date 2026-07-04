import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ["Lead", "Customer", "User", "Auth"],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    details: { type: String, default: "" },
  },
  { timestamps: true }
);

activitySchema.index({ createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
