import Customer from "../models/Customer.js";
import { logActivity } from "../utils/logActivity.js";

const getCustomerFilter = (req) =>
  req.user.role === "admin" ? {} : { assignedTo: req.user._id };

export const getCustomers = async (req, res) => {
  const filter = getCustomerFilter(req);
  const { search, status } = req.query;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }
  const customers = await Customer.find(filter)
    .populate("assignedTo", "name email")
    .sort("-createdAt");
  res.json(customers);
};

export const getCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id).populate(
    "assignedTo",
    "name email"
  );
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  if (req.user.role !== "admin" && customer.assignedTo?._id?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to access this customer");
  }
  res.json(customer);
};

export const createCustomer = async (req, res) => {
  const { name, email, phone, company, address, industry, revenue, status, notes } =
    req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error("Name and email are required");
  }
  const assignTo =
    req.user.role === "admin" ? req.body.assignedTo || null : req.user._id;
  const customer = await Customer.create({
    name,
    email,
    phone,
    company,
    address,
    industry,
    revenue,
    status,
    notes,
    assignedTo: assignTo,
  });
  await customer.populate("assignedTo", "name email");
  await logActivity({
    user: req.user,
    action: "created customer",
    entityType: "Customer",
    entityId: customer._id,
    details: `Created customer ${customer.name} (${customer.company || "no company"})`,
  });
  res.status(201).json(customer);
};

export const updateCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  if (req.user.role !== "admin" && customer.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this customer");
  }
  Object.assign(customer, req.body);
  if (req.user.role !== "admin") customer.assignedTo = req.user._id;
  await customer.save();
  await customer.populate("assignedTo", "name email");
  await logActivity({
    user: req.user,
    action: "updated customer",
    entityType: "Customer",
    entityId: customer._id,
    details: `Updated customer ${customer.name}`,
  });
  res.json(customer);
};

export const deleteCustomer = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }
  if (req.user.role !== "admin" && customer.assignedTo?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this customer");
  }
  await customer.deleteOne();
  await logActivity({
    user: req.user,
    action: "deleted customer",
    entityType: "Customer",
    entityId: customer._id,
    details: `Deleted customer ${customer.name}`,
  });
  res.json({ message: "Customer deleted" });
};
