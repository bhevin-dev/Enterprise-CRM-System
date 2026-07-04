import { useCallback, useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, Users, Eye, ArrowLeft, Mail, Phone, Building2, MapPin } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import CustomerForm from "../components/CustomerForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Spinner from "../components/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const Customers = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [detail, setDetail] = useState(null);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    api
      .get("/customers", { params })
      .then((r) => setCustomers(r.data))
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, [search, toast]);

  useEffect(() => {
    const t = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(t);
  }, [fetchCustomers]);

  const handleDelete = async () => {
    try {
      await api.delete(`/customers/${deleteId}`);
      toast.success("Customer deleted");
      fetchCustomers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const fmtMoney = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

  if (detail) {
    return (
      <div>
        <button className="btn-ghost mb-4" onClick={() => setDetail(null)}>
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-xl font-bold text-slate-200">
                {detail.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100">{detail.name}</h2>
                <p className="text-sm text-slate-400">{detail.company || "—"}</p>
                <div className="mt-1"><StatusBadge status={detail.status} /></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => { setEditing(detail); setFormOpen(true); }}>
                <Pencil className="h-4 w-4" /> Edit
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 p-3">
              <Mail className="h-5 w-5 text-slate-500" />
              <div><p className="text-xs text-slate-500">Email</p><p className="text-sm text-slate-200">{detail.email}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 p-3">
              <Phone className="h-5 w-5 text-slate-500" />
              <div><p className="text-xs text-slate-500">Phone</p><p className="text-sm text-slate-200">{detail.phone || "—"}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 p-3">
              <Building2 className="h-5 w-5 text-slate-500" />
              <div><p className="text-xs text-slate-500">Industry</p><p className="text-sm text-slate-200">{detail.industry || "—"}</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-slate-800 p-3">
              <MapPin className="h-5 w-5 text-slate-500" />
              <div><p className="text-xs text-slate-500">Address</p><p className="text-sm text-slate-200">{detail.address || "—"}</p></div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-800 p-4">
              <p className="text-xs text-slate-500">Revenue</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">{fmtMoney(detail.revenue)}</p>
            </div>
            <div className="rounded-lg border border-slate-800 p-4">
              <p className="text-xs text-slate-500">Assigned To</p>
              <p className="mt-1 text-sm text-slate-200">{detail.assignedTo?.name || "Unassigned"}</p>
            </div>
          </div>

          {detail.notes && (
            <div className="mt-4 rounded-lg border border-slate-800 p-4">
              <p className="text-xs text-slate-500">Notes</p>
              <p className="mt-1 text-sm text-slate-300">{detail.notes}</p>
            </div>
          )}
        </div>

        <CustomerForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          customer={editing}
          onSaved={() => { fetchCustomers(); api.get(`/customers/${detail._id}`).then((r) => setDetail(r.data)); toast.success("Customer updated"); }}
          isAdmin={user?.role === "admin"}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer relationships"
        action={
          <button className="btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Add Customer
          </button>
        }
      />

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          className="input pl-10"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner className="h-8 w-8" /></div>
      ) : customers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <Users className="mb-3 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">No customers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => (
            <div key={c._id} className="card p-5 transition hover:border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-700 font-semibold text-slate-200">
                    {c.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.company || "—"}</p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="mt-4 space-y-1 text-sm text-slate-400">
                <p className="truncate">{c.email}</p>
                <p>{c.industry || "—"}</p>
                <p className="font-medium text-emerald-400">{fmtMoney(c.revenue)}</p>
              </div>
              <div className="mt-4 flex gap-2 border-t border-slate-800 pt-3">
                <button className="btn-ghost flex-1" onClick={() => setDetail(c)}>
                  <Eye className="h-4 w-4" /> View
                </button>
                <button className="btn-ghost" onClick={() => { setEditing(c); setFormOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button className="btn-ghost text-red-400 hover:bg-red-500/10" onClick={() => setDeleteId(c._id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CustomerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        customer={editing}
        onSaved={() => { fetchCustomers(); toast.success(editing ? "Customer updated" : "Customer created"); }}
        isAdmin={user?.role === "admin"}
      />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
      />
    </div>
  );
};

export default Customers;
