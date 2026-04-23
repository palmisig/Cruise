import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ShipComparison from "./pages/ShipComparison";
import ItineraryExplorer from "./pages/ItineraryExplorer";
import CruisePassport from "./pages/CruisePassport";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="compare" element={<ShipComparison />} />
          <Route path="itineraries" element={<ItineraryExplorer />} />
          <Route path="passport" element={<CruisePassport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
