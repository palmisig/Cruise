import { useState } from "react";
import { ships } from "../data/ships";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { ChevronDown, Anchor, Zap, Users, Layers, Utensils, Waves } from "lucide-react";

// ── Ship Silhouette SVG ──────────────────────────────────────────────
function ShipSilhouette({ lengthM, color, label, maxLength }) {
  const scale = lengthM / maxLength;
  const w = Math.round(380 * scale);
  const h = 80;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={w} height={h} viewBox={`0 0 380 80`} preserveAspectRatio="none" style={{ width: w, height: h }}>
        {/* Hull */}
        <path
          d="M0,60 L10,80 L370,80 L380,65 L360,50 L40,50 Z"
          fill={color}
          opacity="0.9"
        />
        {/* Superstructure */}
        <rect x="60" y="30" width="220" height="22" rx="2" fill={color} />
        <rect x="90" y="14" width="150" height="18" rx="2" fill={color} opacity="0.85" />
        <rect x="120" y="4" width="80" height="12" rx="2" fill={color} opacity="0.7" />
        {/* Funnel */}
        <rect x="220" y="2" width="22" height="30" rx="3" fill={color} opacity="0.8" />
        {/* Windows row */}
        {[80, 100, 120, 140, 160, 180, 200, 220, 240, 260].map((x) => (
          <rect key={x} x={x} y="35" width="10" height="6" rx="1" fill="rgba(255,255,255,0.25)" />
        ))}
        {/* Waterline */}
        <line x1="0" y1="72" x2="380" y2="72" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      </svg>
      <div className="text-xs text-slate-400">{lengthM}m</div>
    </div>
  );
}

// ── Selector ────────────────────────────────────────────────────────
function ShipSelector({ value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const options = ships.filter((s) => s.id !== exclude);
  const selected = ships.find((s) => s.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-3 w-full text-left transition-colors"
      >
        <Anchor size={16} className="text-sky-400 shrink-0" />
        <div className="flex-1 min-w-0">
          {selected ? (
            <>
              <div className="font-semibold text-white text-sm truncate">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.line} · {selected.year}</div>
            </>
          ) : (
            <span className="text-slate-400 text-sm">Select a ship…</span>
          )}
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          {options.map((s) => (
            <button
              key={s.id}
              onClick={() => { onChange(s.id); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-700 transition-colors text-left border-b border-slate-700/50 last:border-0"
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: s.colorAccent }} />
              <div>
                <div className="text-sm font-medium text-white">{s.name}</div>
                <div className="text-xs text-slate-400">{s.line} · {s.class} · {s.grossTonnage.toLocaleString()} GT</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Spec row comparison ──────────────────────────────────────────────
function SpecRow({ label, a, b, higherIsBetter = true }) {
  const aNum = parseFloat(String(a).replace(/[^0-9.]/g, ""));
  const bNum = parseFloat(String(b).replace(/[^0-9.]/g, ""));
  const aWins = higherIsBetter ? aNum > bNum : aNum < bNum;
  const bWins = higherIsBetter ? bNum > aNum : bNum < aNum;

  return (
    <div className="flex items-center text-sm border-b border-slate-800 py-2.5">
      <div className={`flex-1 text-right pr-4 font-medium ${aWins ? "text-sky-400" : "text-slate-300"}`}>{a}</div>
      <div className="w-36 text-center text-xs text-slate-500 shrink-0">{label}</div>
      <div className={`flex-1 text-left pl-4 font-medium ${bWins ? "text-amber-400" : "text-slate-300"}`}>{b}</div>
    </div>
  );
}

// ── Amenity bar ──────────────────────────────────────────────────────
function AmenityBar({ name, aVal, bVal, aMax, bMax, colorA, colorB }) {
  const aPct = (aVal / aMax) * 100;
  const bPct = (bVal / bMax) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span className="font-medium" style={{ color: colorA }}>{aVal}</span>
        <span className="text-slate-500">{name}</span>
        <span className="font-medium" style={{ color: colorB }}>{bVal}</span>
      </div>
      <div className="flex gap-1 h-2.5">
        <div className="flex-1 bg-slate-800 rounded-l-full overflow-hidden flex justify-end">
          <div className="h-full rounded-l-full transition-all duration-700" style={{ width: `${aPct}%`, background: colorA }} />
        </div>
        <div className="flex-1 bg-slate-800 rounded-r-full overflow-hidden">
          <div className="h-full rounded-r-full transition-all duration-700" style={{ width: `${bPct}%`, background: colorB }} />
        </div>
      </div>
    </div>
  );
}

// ── Radar config ─────────────────────────────────────────────────────
function buildRadarData(a, b) {
  const normalize = (val, max) => Math.round((val / max) * 100);
  return [
    { subject: "Size", a: normalize(a.grossTonnage, 250000), b: normalize(b.grossTonnage, 250000) },
    { subject: "Capacity", a: normalize(a.maxPassengers, 7000), b: normalize(b.maxPassengers, 7000) },
    { subject: "Speed", a: normalize(a.speed, 32), b: normalize(b.speed, 32) },
    { subject: "Dining", a: normalize(a.restaurants, 45), b: normalize(b.restaurants, 45) },
    { subject: "Pools", a: normalize(a.pools, 10), b: normalize(b.pools, 10) },
    { subject: "Decks", a: normalize(a.decks, 22), b: normalize(b.decks, 22) },
  ];
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-slate-300 font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function ShipComparison() {
  const [shipAId, setShipAId] = useState("wonder-of-the-seas");
  const [shipBId, setShipBId] = useState("queen-mary-2");

  const A = ships.find((s) => s.id === shipAId);
  const B = ships.find((s) => s.id === shipBId);
  const maxLength = Math.max(A?.lengthM ?? 0, B?.lengthM ?? 0, 1);
  const radarData = A && B ? buildRadarData(A, B) : [];

  // Build bar chart data for GT comparison
  const gtData = A && B ? [
    { name: A.name.split(" ").slice(-2).join(" "), value: A.grossTonnage, color: "#38bdf8" },
    { name: B.name.split(" ").slice(-2).join(" "), value: B.grossTonnage, color: "#f59e0b" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Ship Comparison</h1>
        <p className="text-slate-400 mt-1">Select two ships to compare specs, amenities, and characteristics side by side.</p>
      </div>

      {/* Selectors */}
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div>
          <div className="text-xs text-sky-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Ship A
          </div>
          <ShipSelector value={shipAId} onChange={setShipAId} exclude={shipBId} />
        </div>
        <div>
          <div className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-2 flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Ship B
          </div>
          <ShipSelector value={shipBId} onChange={setShipBId} exclude={shipAId} />
        </div>
      </div>

      {A && B && (
        <div className="space-y-6">
          {/* Silhouette comparison */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Size comparison</h2>
            <div className="space-y-8">
              <div>
                <div className="text-xs text-sky-400 mb-3 font-medium">{A.name}</div>
                <ShipSilhouette lengthM={A.lengthM} color="#38bdf8" label={A.name} maxLength={maxLength} />
              </div>
              <div>
                <div className="text-xs text-amber-400 mb-3 font-medium">{B.name}</div>
                <ShipSilhouette lengthM={B.lengthM} color="#f59e0b" label={B.name} maxLength={maxLength} />
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-6">Silhouettes drawn to scale relative to each other.</p>
          </div>

          {/* Charts row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Radar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Performance profile</h2>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Radar name={A.name} dataKey="a" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                  <Radar name={B.name} dataKey="b" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 text-xs mt-2">
                <span className="flex items-center gap-1.5 text-sky-400"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />{A.name.split(" ").slice(0, 2).join(" ")}</span>
                <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />{B.name.split(" ").slice(0, 2).join(" ")}</span>
              </div>
            </div>

            {/* GT Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Gross tonnage</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={gtData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                    {gtData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Onboard amenities</h2>
            <div className="max-w-xl mx-auto">
              {A.amenities.map((am, i) => {
                const bAm = B.amenities[i];
                return (
                  <AmenityBar
                    key={am.name}
                    name={am.name}
                    aVal={am.value}
                    bVal={bAm.value}
                    aMax={am.max}
                    bMax={bAm.max}
                    colorA="#38bdf8"
                    colorB="#f59e0b"
                  />
                );
              })}
            </div>
          </div>

          {/* Specs table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Technical specifications</h2>
            {/* Column headers */}
            <div className="flex items-center text-sm border-b border-slate-700 pb-3 mb-1">
              <div className="flex-1 text-right pr-4 text-sky-400 font-semibold text-xs uppercase">{A.name.split(" ").slice(0, 2).join(" ")}</div>
              <div className="w-36 text-center" />
              <div className="flex-1 text-left pl-4 text-amber-400 font-semibold text-xs uppercase">{B.name.split(" ").slice(0, 2).join(" ")}</div>
            </div>
            <SpecRow label="Gross Tonnage" a={A.specs["Gross Tonnage"]} b={B.specs["Gross Tonnage"]} />
            <SpecRow label="Length" a={A.specs["Length"]} b={B.specs["Length"]} />
            <SpecRow label="Beam" a={A.specs["Beam"]} b={B.specs["Beam"]} />
            <SpecRow label="Passengers" a={A.specs["Passengers"]} b={B.specs["Passengers"]} />
            <SpecRow label="Crew" a={A.specs["Crew"]} b={B.specs["Crew"]} />
            <SpecRow label="Decks" a={A.specs["Decks"]} b={B.specs["Decks"]} />
            <SpecRow label="Cabins" a={A.specs["Cabins"]} b={B.specs["Cabins"]} />
            <SpecRow label="Pools" a={A.specs["Pools"]} b={B.specs["Pools"]} />
            <SpecRow label="Restaurants" a={A.specs["Restaurants"]} b={B.specs["Restaurants"]} />
            <SpecRow label="Max Speed" a={A.specs["Max Speed"]} b={B.specs["Max Speed"]} />

            <p className="text-xs text-slate-600 mt-4">Highlighted values indicate the higher/better figure.</p>
          </div>

          {/* Quick facts */}
          <div className="grid md:grid-cols-2 gap-6">
            {[A, B].map((ship, i) => (
              <div key={ship.id} className={`rounded-2xl border p-6 ${i === 0 ? "border-sky-500/20 bg-sky-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${i === 0 ? "text-sky-400" : "text-amber-400"}`}>{ship.name}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Cruise Line</span><span className="text-white font-medium">{ship.line}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Ship Class</span><span className="text-white font-medium">{ship.class}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Year Built</span><span className="text-white font-medium">{ship.year}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Home Port</span><span className="text-white font-medium">{ship.homeport}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-400">Routes</span><span className="text-white font-medium">{ship.itinerary.join(", ")}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
