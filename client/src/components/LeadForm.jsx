import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import Spinner from "./Spinner.jsx";
import api from "../api/axios";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];
const SOURCES = ["Website", "Referral", "Cold Call", "Email", "Social Media", "Other"];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  status: "New",
  value: 0,
  assignedTo: "",
  notes: "",
};

const LeadForm = ({ open, onClose, lead, onSaved, isAdmin }) => {
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setForm({
        ...emptyForm,
        ...lead,
        assignedTo: lead.assignedTo?._id || lead.assignedTo || "",
        value: lead.value || 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [lead, open]);

  useEffect(() => {
    if (isAdmin) {
      api.get("/users").then((r) => setUsers(r.data)).catch(() => {});
    }
  }, [isAdmin]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, value: Number(form.value) || 0 };
      if (lead) {
        await api.put(`/leads/${lead._id}`, payload);
      } else {
        await api.post("/leads", payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={lead ? "Edit Lead" : "Add Lead"} size="lg">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Name *</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email *</label>
            <input type="email" className="input" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Company</label>
            <input className="input" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </div>
          <div>
            <label className="label">Source</label>
            <select className="input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
              {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Deal Value ($)</label>
            <input type="number" min="0" className="input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          {isAdmin && (
            <div>
              <label className="label">Assign To</label>
              <select className="input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {users.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Spinner className="h-4 w-4" /> : lead ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LeadForm;
