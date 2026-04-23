export default function StatCard({ label, value, sub, accent = "sky" }) {
  const colors = {
    sky: "border-sky-500/20 bg-sky-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    violet: "border-violet-500/20 bg-violet-500/5",
    teal: "border-teal-500/20 bg-teal-500/5",
    rose: "border-rose-500/20 bg-rose-500/5",
  };
  const text = {
    sky: "text-sky-400",
    amber: "text-amber-400",
    violet: "text-violet-400",
    teal: "text-teal-400",
    rose: "text-rose-400",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[accent]}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${text[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}
