import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { logActivity } from "../utils/logActivity.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Email already registered");
  }
  // Only an admin can create admin accounts; default role is sales.
  let assignedRole = "sales";
  if (role === "admin" && req.user?.role === "admin") {
    assignedRole = "admin";
  }
  const user = await User.create({ name, email, password, role: assignedRole });
  await logActivity({
    user,
    action: "registered",
    entityType: "Auth",
    details: `${user.name} (${user.email}) registered as ${user.role}`,
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  await logActivity({
    user,
    action: "logged in",
    entityType: "Auth",
    details: `${user.name} logged in`,
  });
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const logout = async (req, res) => {
  await logActivity({
    user: req.user,
    action: "logged out",
    entityType: "Auth",
    details: `${req.user.name} logged out`,
  });
  res.json({ message: "Logged out successfully" });
};
