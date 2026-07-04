import User from "../models/User.js";
import { logActivity } from "../utils/logActivity.js";

export const getUsers = async (req, res) => {
  const users = await User.find().populate("assignedLeads", "name status").sort("-createdAt");
  res.json(users);
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate("assignedLeads", "name status");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
};

export const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error("Email already registered");
  }
  const user = await User.create({
    name,
    email,
    password,
    role: role === "admin" ? "admin" : "sales",
  });
  await logActivity({
    user: req.user,
    action: "created user",
    entityType: "User",
    entityId: user._id,
    details: `Created ${user.role} user ${user.name} (${user.email})`,
  });
  res.status(201).json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const { name, email, role, password } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role === "admin" ? "admin" : "sales";
  if (password) user.password = password;
  await user.save();
  await logActivity({
    user: req.user,
    action: "updated user",
    entityType: "User",
    entityId: user._id,
    details: `Updated user ${user.name} (${user.email})`,
  });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error("Cannot delete the last admin user");
    }
  }
  await user.deleteOne();
  await logActivity({
    user: req.user,
    action: "deleted user",
    entityType: "User",
    entityId: req.params.id,
    details: `Deleted user ${user.name} (${user.email})`,
  });
  res.json({ message: "User deleted" });
};
