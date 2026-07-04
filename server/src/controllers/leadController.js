import Lead from "../models/Lead.js";
import { logActivity } from "../utils/logActivity.js";

// Sales executives only see leads assigned to them; admins see all.
const getLeadFilter = (req) =>
  req.user.role === "admin" ? {} : { assignedTo: req.user._id };

export const getLeads = async (req, res) => {
  const filter = getLeadFilter(req);
  const { search, status, source } = req.query;
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  const leads = await Lead.find(filter)
    .populate("assignedTo", "name email")
    .sort("-createdAt");
  res.json(leads);
};

export const getLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id).populate(
    "assignedTo",
    "name email"
  );
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  if (req.user.role !== "admin" && lead.assignedTo?._id?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this lead");
  }
  res.json(lead);
};

export const createLead = async (req, res) => {
  const { name, email, phone, company, source, status, value, assignedTo, notes } =
    req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }
  // Sales executives can only assign leads to themselves.
  const assignTo =
    req.user.role === "admin" ? assignedTo || null : req.user._id;
  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    source,
    status,
    value,
    assignedTo: assignTo,
    notes,
  });
  await lead.populate("assignedTo", "name email");
  await logActivity({
    user: req.user,
    action: "created lead",
    entityType: "Lead",
    entityId: lead._id,
    details: `Created lead ${lead.name} (${lead.company || "no company"})`,
  });
  res.status(201).json(lead);
};

export const updateLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  if (req.user.role !== "admin" && lead.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this lead");
  }
  const prevStatus = lead.status;
  Object.assign(lead, req.body);
  if (req.user.role !== "admin") lead.assignedTo = req.user._id;
  await lead.save();
  await lead.populate("assignedTo", "name email");
  await logActivity({
    user: req.user,
    action: "updated lead",
    entityType: "Lead",
    entityId: lead._id,
    details:
      prevStatus !== lead.status
        ? `Moved ${lead.name} from ${prevStatus} to ${lead.status}`
        : `Updated lead ${lead.name}`,
  });
  res.json(lead);
};

export const deleteLead = async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  if (req.user.role !== "admin" && lead.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this lead");
  }
  await lead.deleteOne();
  await logActivity({
    user: req.user,
    action: "deleted lead",
    entityType: "Lead",
    entityId: lead._id,
    details: `Deleted lead ${lead.name}`,
  });
  res.json({ message: "Lead deleted" });
};

// Bulk update status (used by the Kanban drag-and-drop board).
export const updateLeadStatus = async (req, res) => {
  const { status } = req.body;
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  if (req.user.role !== "admin" && lead.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this lead");
  }
  const prevStatus = lead.status;
  lead.status = status;
  await lead.save();
  await lead.populate("assignedTo", "name email");
  await logActivity({
    user: req.user,
    action: "moved lead",
    entityType: "Lead",
    entityId: lead._id,
    details: `Moved ${lead.name} from ${prevStatus} to ${status}`,
  });
  res.json(lead);
};
