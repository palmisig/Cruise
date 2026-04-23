import { useState, useMemo } from "react";
import { itineraries, destinations, departurePorts, categories } from "../data/itineraries";
import { MapPin, Clock, DollarSign, Anchor, ChevronDown, X, SlidersHorizontal } from "lucide-react";

const categoryColors = {
  Budget: { badge: "bg-green-500/15 text-green-400 border-green-500/20", dot: "bg-green-400" },
  Standard: { badge: "bg-sky-500/15 text-sky-400 border-sky-500/20", dot: "bg-sky-400" },
  Premium: { badge: "bg-violet-500/15 text-violet-400 border-violet-500/20", dot: "bg-violet-400" },
  Luxury: { badge: "bg-amber-500/15 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
};

const badgeColors = {
  "Best Seller": "bg-rose-500/15 text-rose-400 border border-rose-500/20",
  "Iconic": "bg-violet-500/15 text-violet-400 border border-violet-500/20",
  "Hot Deal": "bg-orange-500/15 text-orange-400 border border-orange-500/20",
  "All-Inclusive": "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  "Short Break": "bg-sky-500/15 text-sky-400 border border-sky-500/20",
  "Family Pick": "bg-pink-500/15 text-pink-400 border border-pink-500/20",
  "Expedition": "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  "Winter Sun": "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  "World Voyage": "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",
};

function FilterSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <label className="block text-xs text-slate-500 mb-1.5 font-medium">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:border-sky-500 transition-colors"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}

function NightRangeSlider({ min, max, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5 font-medium">Duration: <span className="text-slate-300">{value[0]}–{value[1]} nights</span></label>
      <div className="relative h-6 flex items-center">
        <div className="w-full h-1.5 bg-slate-700 rounded-full relative">
          <div
            className="absolute h-full bg-sky-500 rounded-full"
            style={{ left: `${((value[0] - min) / (max - min)) * 100}%`, right: `${100 - ((value[1] - min) / (max - min)) * 100}%` }}
          />
        </div>
        {[0, 1].map((i) => (
          <input
            key={i}
            type="range"
            min={min}
            max={max}
            value={value[i]}
            onChange={(e) => {
              const next = [...value];
              next[i] = Number(e.target.value);
              if (i === 0 && next[0] > next[1]) return;
              if (i === 1 && next[1] < next[0]) return;
              onChange(next);
            }}
            className="absolute w-full h-full opacity-0 cursor-pointer"
            style={{ pointerEvents: "auto" }}
          />
        ))}
      </div>
    </div>
  );
}

function PriceRangeSlider({ min, max, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5 font-medium">Price from: <span className="text-slate-300">${value[0].toLocaleString()}–${value[1].toLocaleString()}</span></label>
      <input
        type="range"
        min={min}
        max={max}
        step={50}
        value={value[1]}
        onChange={(e) => onChange([value[0], Number(e.target.value)])}
        className="w-full accent-sky-500"
      />
    </div>
  );
}

function ItineraryCard({ it }) {
  const cat = categoryColors[it.priceCategory];
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-colors">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {it.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[it.badge]}`}>{it.badge}</span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${cat.badge}`}>{it.priceCategory}</span>
            </div>
            <h3 className="font-semibold text-white text-base leading-tight">{it.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Anchor size={11} />{it.ship} · {it.line}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-white">${it.priceFrom.toLocaleString()}</div>
            <div className="text-xs text-slate-500">per person</div>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1"><Clock size={11} />{it.nights} nights</span>
          <span className="flex items-center gap-1"><MapPin size={11} />{it.departurePort}</span>
          <span className="flex items-center gap-1"><DollarSign size={11} />{it.destination}</span>
        </div>

        {/* Departure date */}
        <div className="text-xs text-slate-500 mb-3">
          Departs: <span className="text-slate-300">{new Date(it.departure).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>

        {/* Ports preview */}
        <div className="flex flex-wrap gap-1.5">
          {(expanded ? it.ports : it.ports.slice(0, 3)).map((p) => (
            <span key={p} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{p}</span>
          ))}
          {it.ports.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-sky-400 hover:text-sky-300 px-2 py-0.5 rounded-full hover:bg-sky-500/10 transition-colors"
            >
              {expanded ? "less" : `+${it.ports.length - 3} more`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: "date-asc", label: "Departure: earliest" },
  { value: "date-desc", label: "Departure: latest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "nights-asc", label: "Duration: shortest" },
  { value: "nights-desc", label: "Duration: longest" },
];

export default function ItineraryExplorer() {
  const [dest, setDest] = useState("");
  const [port, setPort] = useState("");
  const [cat, setCat] = useState("");
  const [nights, setNights] = useState([4, 21]);
  const [maxPrice, setMaxPrice] = useState([0, 8000]);
  const [sort, setSort] = useState("date-asc");
  const [showFilters, setShowFilters] = useState(true);

  const allPrices = itineraries.map((i) => i.priceFrom);
  const priceMin = Math.min(...allPrices);
  const priceMax = Math.max(...allPrices);

  const activeFilterCount = [dest, port, cat].filter(Boolean).length +
    (nights[0] !== 4 || nights[1] !== 21 ? 1 : 0) +
    (maxPrice[1] !== 8000 ? 1 : 0);

  const clearFilters = () => {
    setDest(""); setPort(""); setCat("");
    setNights([4, 21]); setMaxPrice([0, 8000]);
  };

  const filtered = useMemo(() => {
    let list = itineraries.filter((it) => {
      if (dest && it.destination !== dest) return false;
      if (port && it.departurePort !== port) return false;
      if (cat && it.priceCategory !== cat) return false;
      if (it.nights < nights[0] || it.nights > nights[1]) return false;
      if (it.priceFrom > maxPrice[1]) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.priceFrom - b.priceFrom;
        case "price-desc": return b.priceFrom - a.priceFrom;
        case "nights-asc": return a.nights - b.nights;
        case "nights-desc": return b.nights - a.nights;
        case "date-desc": return new Date(b.departure) - new Date(a.departure);
        default: return new Date(a.departure) - new Date(b.departure);
      }
    });
    return list;
  }, [dest, port, cat, nights, maxPrice, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Itinerary Explorer</h1>
          <p className="text-slate-400 mt-1">Filter and discover sailings that match your ideal voyage.</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm px-4 py-2 rounded-xl transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filters {activeFilterCount > 0 && <span className="bg-sky-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        {showFilters && (
          <aside className="w-64 shrink-0 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Filters</span>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors">
                    <X size={12} /> Clear all
                  </button>
                )}
              </div>
              <FilterSelect label="Destination" value={dest} onChange={setDest} options={destinations} placeholder="All destinations" />
              <FilterSelect label="Departure Port" value={port} onChange={setPort} options={departurePorts} placeholder="All ports" />
              <FilterSelect label="Price Category" value={cat} onChange={setCat} options={categories} placeholder="All categories" />
              <NightRangeSlider min={4} max={21} value={nights} onChange={setNights} />
              <PriceRangeSlider min={priceMin} max={priceMax} value={maxPrice} onChange={setMaxPrice} />
            </div>
          </aside>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Sort + count bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="text-sm text-slate-400">
              <span className="text-white font-semibold">{filtered.length}</span> sailings found
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-xl px-4 py-2 pr-8 focus:outline-none focus:border-sky-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <div className="text-4xl mb-3">⚓</div>
              <p className="text-slate-400">No sailings match your filters.</p>
              <button onClick={clearFilters} className="mt-4 text-sm text-sky-400 hover:text-sky-300 transition-colors">Clear filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-4">
              {filtered.map((it) => (
                <ItineraryCard key={it.id} it={it} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
