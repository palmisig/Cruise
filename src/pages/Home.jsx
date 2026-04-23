import { Link } from "react-router-dom";
import { BarChart2, Map, BookOpen, ArrowRight } from "lucide-react";

const features = [
  {
    to: "/compare",
    icon: BarChart2,
    title: "Ship Comparison",
    desc: "Compare two ships side by side — scaled silhouettes, tonnage, amenities, and deck-by-deck breakdowns.",
    color: "sky",
  },
  {
    to: "/itineraries",
    icon: Map,
    title: "Itinerary Explorer",
    desc: "Browse and filter hundreds of sailings by destination, departure port, duration, and price tier.",
    color: "teal",
  },
  {
    to: "/passport",
    icon: BookOpen,
    title: "Cruise Passport",
    desc: "Your personal cruise journal — track history, map every port visited, and review your at-sea stats.",
    color: "violet",
  },
];

const colorsMap = {
  sky: { icon: "text-sky-400", border: "border-sky-500/20", bg: "bg-sky-500/8", hover: "hover:border-sky-500/40", arrow: "text-sky-400" },
  teal: { icon: "text-teal-400", border: "border-teal-500/20", bg: "bg-teal-500/8", hover: "hover:border-teal-500/40", arrow: "text-teal-400" },
  violet: { icon: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/8", hover: "hover:border-violet-500/40", arrow: "text-violet-400" },
};

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          Built for experienced cruisers
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
          Serious tools for<br />
          <span className="text-sky-400">serious cruisers</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          CruiseAnalyst gives you the data-driven tools to compare ships, discover itineraries, and track your journey across the seven seas.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map(({ to, icon: Icon, title, desc, color }) => {
          const c = colorsMap[color];
          return (
            <Link
              key={to}
              to={to}
              className={`group rounded-2xl border ${c.border} ${c.bg} ${c.hover} p-8 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800/60`}>
                <Icon className={c.icon} size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${c.arrow} mt-auto`}>
                Open tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats strip */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800 pt-12">
        {[
          { label: "Ships in database", value: "6" },
          { label: "Itineraries", value: "12+" },
          { label: "Destinations", value: "8" },
          { label: "Ports charted", value: "40+" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
