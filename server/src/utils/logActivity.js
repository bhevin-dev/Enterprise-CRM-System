import Activity from "../models/Activity.js";

export const logActivity = async ({
  user,
  action,
  entityType,
  entityId = null,
  details = "",
}) => {
  try {
    await Activity.create({
      user: user._id,
      userName: user.name,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};
