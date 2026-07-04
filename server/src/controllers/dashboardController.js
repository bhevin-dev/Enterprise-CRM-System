import Lead from "../models/Lead.js";
import Customer from "../models/Customer.js";
import Activity from "../models/Activity.js";

export const getDashboard = async (req, res) => {
  const leadFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
  const customerFilter =
    req.user.role === "admin" ? {} : { assignedTo: req.user._id };

  const totalLeads = await Lead.countDocuments(leadFilter);
  const totalCustomers = await Customer.countDocuments(customerFilter);
  const dealsWon = await Lead.countDocuments({ ...leadFilter, status: "Won" });

  const wonLeads = await Lead.find({ ...leadFilter, status: "Won" });
  const revenue = wonLeads.reduce((sum, l) => sum + (l.value || 0), 0);

  // Monthly sales chart: revenue from Won deals grouped by month for current year.
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const monthlyAgg = await Lead.aggregate([
    { $match: { ...leadFilter, status: "Won", createdAt: { $gte: yearStart } } },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$value" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySales = monthNames.map((m, i) => {
    const found = monthlyAgg.find((a) => a._id === i + 1);
    return { month: m, revenue: found ? found.total : 0, deals: found ? found.count : 0 };
  });

  // Leads by status (for pipeline overview).
  const statusAgg = await Lead.aggregate([
    { $match: leadFilter },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const leadsByStatus = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"].map(
    (s) => ({
      status: s,
      count: statusAgg.find((a) => a._id === s)?.count || 0,
    })
  );

  const recentActivities = await Activity.find()
    .sort("-createdAt")
    .limit(8);

  res.json({
    totalLeads,
    totalCustomers,
    dealsWon,
    revenue,
    monthlySales,
    leadsByStatus,
    recentActivities,
  });
};
