import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Briefcase } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import LeadForm from "../components/LeadForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const STATUSES = ["All", "New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];

const Leads = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (status !== "All") params.status = status;
    api
      .get("/leads", { params })
      .then((r) => setLeads(r.data))
      .catch(() => toast.error("Failed to load leads"))
      .finally(() => setLoading(false));
  }, [search, status, toast]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 300);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${deleteId}`);
      toast.success("Lead deleted");
      fetchLeads();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const fmtMoney = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Manage your sales leads"
        action={
          <button
            className="btn-primary"
            onClick={() => { setEditing(null); setFormOpen(true); }}
          >
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-10"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                status === s
                  ? "bg-brand-600 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : leads.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Briefcase className="mb-3 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">No leads found. Create your first lead to get started.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  {user?.role === "admin" && <th className="px-4 py-3 font-medium">Assigned</th>}
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-200">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{lead.company || "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                    <td className="px-4 py-3 text-slate-300">{fmtMoney(lead.value)}</td>
                    <td className="px-4 py-3 text-slate-400">{lead.source}</td>
                    {user?.role === "admin" && (
                      <td className="px-4 py-3 text-slate-400">{lead.assignedTo?.name || "—"}</td>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditing(lead); setFormOpen(true); }}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-brand-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(lead._id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <LeadForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        lead={editing}
        onSaved={() => { fetchLeads(); toast.success(editing ? "Lead updated" : "Lead created"); }}
        isAdmin={user?.role === "admin"}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </div>
  );
};

export default Leads;
