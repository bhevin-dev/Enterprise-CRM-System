import { useEffect, useState } from "react";
import { Activity as ActivityIcon, Briefcase, Users, ShieldCheck, LogIn } from "lucide-react";
import api from "../api/axios";
import PageHeader from "../components/PageHeader.jsx";
import Spinner from "../components/Spinner.jsx";

const iconFor = (type) => {
  if (type === "Lead") return Briefcase;
  if (type === "Customer") return Users;
  if (type === "User") return ShieldCheck;
  return LogIn;
};

const colorFor = (type) => {
  if (type === "Lead") return "bg-brand-500/15 text-brand-400";
  if (type === "Customer") return "bg-cyan-500/15 text-cyan-400";
  if (type === "User") return "bg-violet-500/15 text-violet-400";
  return "bg-emerald-500/15 text-emerald-400";
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/activities", { params: { limit: 100 } })
      .then((r) => setActivities(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Activity Logs" subtitle="Track all user actions across the system" />
      {loading ? (
        <div className="flex h-64 items-center justify-center"><Spinner className="h-8 w-8" /></div>
      ) : activities.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-12 text-center">
          <ActivityIcon className="mb-3 h-12 w-12 text-slate-600" />
          <p className="text-slate-400">No activities recorded yet.</p>
        </div>
      ) : (
        <div className="card divide-y divide-slate-800">
          {activities.map((a) => {
            const Icon = iconFor(a.entityType);
            return (
              <div key={a._id} className="flex items-start gap-4 p-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${colorFor(a.entityType)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-200">
                    <span className="font-medium">{a.userName}</span> {a.action}
                  </p>
                  <p className="text-xs text-slate-500">{a.details}</p>
                </div>
                <div className="text-right">
                  <span className="badge bg-slate-800 text-slate-400">{a.entityType}</span>
                  <p className="mt-1 text-xs text-slate-600">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Activities;
