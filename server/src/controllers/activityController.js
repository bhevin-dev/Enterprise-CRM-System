import Activity from "../models/Activity.js";

export const getActivities = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const activities = await Activity.find()
    .sort("-createdAt")
    .limit(limit);
  res.json(activities);
};
