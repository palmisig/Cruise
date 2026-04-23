import { NavLink, Outlet } from "react-router-dom";
import { Anchor, BarChart2, Map, BookOpen } from "lucide-react";

const navItems = [
  { to: "/compare", label: "Ship Comparison", icon: BarChart2 },
  { to: "/itineraries", label: "Itinerary Explorer", icon: Map },
  { to: "/passport", label: "Cruise Passport", icon: BookOpen },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-[#080c18]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 h-16">
          <NavLink to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight shrink-0">
            <Anchor className="text-sky-400" size={22} />
            <span>Cruise<span className="text-sky-400">Analyst</span></span>
          </NavLink>

          <nav className="flex items-center gap-1 ml-4">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  }`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
