import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { cruiseHistory, passportStats } from "../data/passport";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Star, Anchor, Clock, MapPin, DollarSign, Ship, ChevronDown, ChevronUp } from "lucide-react";
import StatCard from "../components/StatCard";

// ── Map ─────────────────────────────────────────────────────────────
function PortMap({ cruises, activeCruise }) {
  const displayPorts = activeCruise
    ? activeCruise.ports
    : passportStats.allPorts;

  const polylinePositions = activeCruise
    ? activeCruise.ports.map((p) => [p.lat, p.lng])
    : null;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800" style={{ height: 360 }}>
      <MapContainer
        center={[30, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%", background: "#0a0f1e" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {polylinePositions && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{ color: "#38bdf8", weight: 2, opacity: 0.6, dashArray: "6 4" }}
          />
        )}

        {displayPorts.map((port, i) => (
          <CircleMarker
            key={`${port.name}-${i}`}
            center={[port.lat, port.lng]}
            radius={activeCruise ? 8 : 6}
            pathOptions={{
              fillColor: "#38bdf8",
              fillOpacity: 0.9,
              color: "#0a0f1e",
              weight: 2,
            }}
          >
            <Popup className="cruise-popup">
              <div style={{ color: "#e2e8f0", background: "#1e293b", padding: "4px 0", minWidth: 120 }}>
                <strong style={{ display: "block", marginBottom: 2, fontSize: 13 }}>{port.name}</strong>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

// ── Star rating ──────────────────────────────────────────────────────
function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={13} className={i <= n ? "text-amber-400 fill-amber-400" : "text-slate-700 fill-slate-700"} />
      ))}
    </div>
  );
}

// ── Cruise history card ──────────────────────────────────────────────
function CruiseCard({ cruise, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 cursor-pointer transition-all ${
        isActive
          ? "border-sky-500/50 bg-sky-500/8"
          : "border-slate-800 bg-slate-900 hover:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-tight">{cruise.name}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Anchor size={10} />{cruise.ship} · {cruise.line}</p>
        </div>
        <Stars n={cruise.rating} />
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2">
        <span className="flex items-center gap-1"><Clock size={10} />{cruise.nights}n</span>
        <span className="flex items-center gap-1"><MapPin size={10} />{cruise.ports.length} ports</span>
        <span className="flex items-center gap-1"><DollarSign size={10} />${cruise.spent.toLocaleString()}</span>
        <span>{cruise.cabin}</span>
      </div>
      <p className="text-xs text-slate-500">{new Date(cruise.departure).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
      {isActive && (
        <p className="text-xs text-slate-400 mt-2 italic border-t border-slate-800 pt-2 leading-relaxed">"{cruise.notes}"</p>
      )}
    </div>
  );
}

// ── Chart helpers ────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill || p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const PIE_COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6"];

export default function CruisePassport() {
  const [activeCruise, setActiveCruise] = useState(null);

  // Chart data
  const nightsData = cruiseHistory.map((c) => ({
    name: c.name.split(" ").slice(0, 2).join(" "),
    nights: c.nights,
    spent: c.spent,
  }));

  const lineData = Object.entries(
    cruiseHistory.reduce((acc, c) => {
      acc[c.line] = (acc[c.line] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const cabinData = Object.entries(
    cruiseHistory.reduce((acc, c) => {
      acc[c.cabin] = (acc[c.cabin] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Cruise Passport</h1>
          <p className="text-slate-400 mt-1">Your personal cruise history, port map, and voyage stats.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
          <Ship size={16} className="text-sky-400" />
          <span className="text-sm text-slate-300 font-medium">Experienced Cruiser</span>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Voyages" value={passportStats.totalCruises} accent="sky" />
        <StatCard label="Nights at Sea" value={passportStats.totalNights} accent="teal" />
        <StatCard label="Ports Visited" value={passportStats.totalPorts} accent="violet" />
        <StatCard label="Total Spent" value={`$${(passportStats.totalSpent / 1000).toFixed(0)}k`} accent="amber" />
        <StatCard label="Cruise Lines" value={passportStats.uniqueLines} accent="rose" />
        <StatCard label="Avg Rating" value={`${passportStats.avgRating}★`} accent="sky" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: cruise history list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Voyage Log</h2>
          {cruiseHistory.map((c) => (
            <CruiseCard
              key={c.id}
              cruise={c}
              isActive={activeCruise?.id === c.id}
              onClick={() => setActiveCruise(activeCruise?.id === c.id ? null : c)}
            />
          ))}
        </div>

        {/* Right: map + charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {activeCruise ? `Route: ${activeCruise.name}` : "All Ports Visited"}
              </h2>
              {activeCruise && (
                <button onClick={() => setActiveCruise(null)} className="text-xs text-slate-400 hover:text-slate-200 transition-colors">
                  Show all ports
                </button>
              )}
            </div>
            <PortMap cruises={cruiseHistory} activeCruise={activeCruise} />
            <p className="text-xs text-slate-600 mt-2">
              {activeCruise
                ? `Click a port marker for details. Dashed line shows sailing route.`
                : `Click a voyage in the log to highlight its route.`}
            </p>
          </div>

          {/* Charts */}
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Nights per cruise */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Nights per voyage</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={nightsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="nights" fill="#38bdf8" radius={[4, 4, 0, 0]} maxBarSize={40} name="Nights" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cruise lines pie */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Cruise lines sailed</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={lineData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" nameKey="name">
                    {lineData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 10 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Spend per cruise */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Spend per voyage ($)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={nightsData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="spent" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={40} name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cabin types */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Cabin types booked</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={cabinData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" nameKey="name">
                    {cabinData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => <span style={{ color: "#94a3b8", fontSize: 10 }}>{v}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
