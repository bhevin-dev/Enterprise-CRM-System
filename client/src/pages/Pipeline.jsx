import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader.jsx";
import Spinner from "../components/Spinner.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useToast } from "../context/ToastContext.jsx";

const COLUMNS = [
  { status: "New", color: "border-t-brand-500" },
  { status: "Contacted", color: "border-t-amber-500" },
  { status: "Qualified", color: "border-t-violet-500" },
  { status: "Proposal", color: "border-t-cyan-500" },
  { status: "Won", color: "border-t-emerald-500" },
  { status: "Lost", color: "border-t-red-500" },
];

const Pipeline = () => {
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    api
      .get("/leads")
      .then((r) => setLeads(r.data))
      .catch(() => toast.error("Failed to load pipeline"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const onDragStart = (id) => setDragId(id);
  const onDrop = async (status) => {
    setDragOver(null);
    if (!dragId) return;
    const lead = leads.find((l) => l._id === dragId);
    if (!lead || lead.status === status) {
      setDragId(null);
      return;
    }
    // Optimistic update
    setLeads((prev) => prev.map((l) => (l._id === dragId ? { ...l, status } : l)));
    try {
      await api.patch(`/leads/${dragId}/status`, { status });
      toast.success(`Moved to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      fetchLeads();
    }
    setDragId(null);
  };

  const fmtMoney = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle="Drag and drop leads between stages"
        action={
          <button className="btn-secondary" onClick={fetchLeads}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          const total = colLeads.reduce((s, l) => s + (l.value || 0), 0);
          return (
            <div
              key={col.status}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.status); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => onDrop(col.status)}
              className={`card flex flex-col border-t-2 ${col.color} ${
                dragOver === col.status ? "ring-2 ring-brand-500/50" : ""
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <StatusBadge status={col.status} />
                  <span className="text-xs text-slate-500">({colLeads.length})</span>
                </div>
              </div>
              <div className="px-3 py-1.5 text-xs text-slate-500">{fmtMoney(total)}</div>
              <div className="flex-1 space-y-2 overflow-y-auto p-2" style={{ maxHeight: "60vh" }}>
                {colLeads.map((lead) => (
                  <div
                    key={lead._id}
                    draggable
                    onDragStart={() => onDragStart(lead._id)}
                    className={`cursor-grab rounded-lg border border-slate-800 bg-slate-900 p-3 transition hover:border-slate-600 active:cursor-grabbing ${
                      dragId === lead._id ? "opacity-40" : ""
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-200">{lead.name}</p>
                    <p className="text-xs text-slate-500">{lead.company || "—"}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{fmtMoney(lead.value)}</span>
                      <span className="text-xs text-slate-600">{lead.source}</span>
                    </div>
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <p className="py-4 text-center text-xs text-slate-600">Drop leads here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;
