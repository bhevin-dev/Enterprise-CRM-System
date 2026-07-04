const STATUS_STYLES = {
  New: "bg-brand-500/15 text-brand-300 border border-brand-500/30",
  Contacted: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Qualified: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
  Proposal: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
  Won: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  Lost: "bg-red-500/15 text-red-300 border border-red-500/30",
  Active: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
  Inactive: "bg-slate-500/15 text-slate-300 border border-slate-500/30",
  Churned: "bg-red-500/15 text-red-300 border border-red-500/30",
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${STATUS_STYLES[status] || STATUS_STYLES.New}`}>
    {status}
  </span>
);

export default StatusBadge;
