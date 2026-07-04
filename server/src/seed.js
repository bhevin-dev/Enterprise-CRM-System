import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import Customer from "./models/Customer.js";
import Activity from "./models/Activity.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const run = async () => {
  await connectDB();
  console.log("Seeding database...");

  await Promise.all([
    User.deleteMany({}),
    Lead.deleteMany({}),
    Customer.deleteMany({}),
    Activity.deleteMany({}),
  ]);

  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || "Admin User",
    email: process.env.SEED_ADMIN_EMAIL || "admin@crm.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Admin@123",
    role: "admin",
  });

  const sales1 = await User.create({
    name: "Sarah Johnson",
    email: "sarah@crm.com",
    password: "Sales@123",
    role: "sales",
  });
  const sales2 = await User.create({
    name: "Mike Chen",
    email: "mike@crm.com",
    password: "Sales@123",
    role: "sales",
  });

  const leadsData = [
    { name: "John Carter", email: "john@techcorp.com", phone: "+1 555-0101", company: "TechCorp", source: "Website", status: "New", value: 5000, assignedTo: sales1._id },
    { name: "Emily Davis", email: "emily@finserve.com", phone: "+1 555-0102", company: "FinServe", source: "Referral", status: "Contacted", value: 12000, assignedTo: sales2._id },
    { name: "Robert Brown", email: "robert@healthplus.com", phone: "+1 555-0103", company: "HealthPlus", source: "Cold Call", status: "Qualified", value: 25000, assignedTo: sales1._id },
    { name: "Linda Wilson", email: "linda@retailco.com", phone: "+1 555-0104", company: "RetailCo", source: "Email", status: "Proposal", value: 18000, assignedTo: sales2._id },
    { name: "David Smith", email: "david@logitrans.com", phone: "+1 555-0105", company: "LogiTrans", source: "Website", status: "Won", value: 45000, assignedTo: sales1._id },
    { name: "Patricia Lee", email: "patricia@edutech.com", phone: "+1 555-0106", company: "EduTech", source: "Referral", status: "Won", value: 32000, assignedTo: sales2._id },
    { name: "James Miller", email: "james@agrico.com", phone: "+1 555-0107", company: "AgriCo", source: "Cold Call", status: "Lost", value: 8000, assignedTo: sales1._id },
    { name: "Jennifer Taylor", email: "jennifer@mediamax.com", phone: "+1 555-0108", company: "MediaMax", source: "Website", status: "New", value: 15000, assignedTo: sales2._id },
    { name: "Thomas Anderson", email: "thomas@cloudnet.com", phone: "+1 555-0109", company: "CloudNet", source: "Email", status: "Contacted", value: 22000, assignedTo: sales1._id },
    { name: "Barbara Martin", email: "barbara@insureplus.com", phone: "+1 555-0110", company: "InsurePlus", source: "Referral", status: "Qualified", value: 38000, assignedTo: sales2._id },
    { name: "Christopher Moore", email: "chris@buildright.com", phone: "+1 555-0111", company: "BuildRight", source: "Website", status: "Proposal", value: 28000, assignedTo: sales1._id },
    { name: "Jessica White", email: "jessica@greenenergy.com", phone: "+1 555-0112", company: "GreenEnergy", source: "Cold Call", status: "Won", value: 55000, assignedTo: sales2._id },
  ];

  const leads = await Lead.insertMany(leadsData);

  // Assign leads to their sales reps.
  await User.findByIdAndUpdate(sales1._id, {
    assignedLeads: leads.filter((l) => l.assignedTo.toString() === sales1._id.toString()).map((l) => l._id),
  });
  await User.findByIdAndUpdate(sales2._id, {
    assignedLeads: leads.filter((l) => l.assignedTo.toString() === sales2._id.toString()).map((l) => l._id),
  });

  const customersData = [
    { name: "David Smith", email: "david@logitrans.com", phone: "+1 555-0105", company: "LogiTrans", address: "123 Freight Ave, Chicago IL", industry: "Logistics", revenue: 45000, status: "Active", assignedTo: sales1._id },
    { name: "Patricia Lee", email: "patricia@edutech.com", phone: "+1 555-0106", company: "EduTech", address: "456 Learning Blvd, Austin TX", industry: "Education", revenue: 32000, status: "Active", assignedTo: sales2._id },
    { name: "Jessica White", email: "jessica@greenenergy.com", phone: "+1 555-0112", company: "GreenEnergy", address: "789 Solar Way, Phoenix AZ", industry: "Energy", revenue: 55000, status: "Active", assignedTo: sales2._id },
    { name: "Olivia Harris", email: "olivia@foodfresh.com", phone: "+1 555-0120", company: "FoodFresh", address: "321 Market St, Denver CO", industry: "Food & Beverage", revenue: 21000, status: "Active", assignedTo: sales1._id },
    { name: "Daniel King", email: "daniel@autodrive.com", phone: "+1 555-0121", company: "AutoDrive", address: "654 Motor Rd, Detroit MI", industry: "Automotive", revenue: 67000, status: "Inactive", assignedTo: sales2._id },
  ];
  await Customer.insertMany(customersData);

  const activities = [
    { user: admin._id, userName: admin.name, action: "registered", entityType: "Auth", details: `${admin.name} registered as admin` },
    { user: sales1._id, userName: sales1.name, action: "created lead", entityType: "Lead", entityId: leads[0]._id, details: `Created lead ${leads[0].name}` },
    { user: sales2._id, userName: sales2.name, action: "created lead", entityType: "Lead", entityId: leads[1]._id, details: `Created lead ${leads[1].name}` },
    { user: sales1._id, userName: sales1.name, action: "moved lead", entityType: "Lead", entityId: leads[4]._id, details: `Moved ${leads[4].name} from Proposal to Won` },
    { user: sales2._id, userName: sales2.name, action: "created customer", entityType: "Customer", details: `Created customer Jessica White` },
    { user: admin._id, userName: admin.name, action: "created user", entityType: "User", entityId: sales1._id, details: `Created sales user ${sales1.name}` },
  ];
  await Activity.insertMany(activities);

  console.log("Seed complete!");
  console.log("Admin login:    admin@crm.com / Admin@123");
  console.log("Sales login:    sarah@crm.com / Sales@123");
  console.log("Sales login:    mike@crm.com  / Sales@123");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
