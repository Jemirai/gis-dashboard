"use client";

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// Fix Leaflet's default icon path issues in Next.js
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [101.6514, 2.9228] },
      "properties": { "license_id": "MPSepang-2026-0012A", "premise_name": "Kama AI Resources Cyberjaya Hub", "category": "Pejabat Urusan / IT", "status": "Lesen Aktif", "payment_status": "Berbayar", "location": "Shaftsbury Square", "last_inspected": "2026-03-15" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [101.6548, 2.9213] },
      "properties": { "license_id": "MPSepang-2025-8843B", "premise_name": "Kafe Cyber Rasa", "category": "Restoran / Kedai Makan", "status": "Lesen Tamat", "payment_status": "Tertunggak", "location": "D'Pulze Shopping Centre", "last_inspected": "2025-11-20" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [101.6572, 2.9255] },
      "properties": { "license_id": "MPSepang-2026-0499C", "premise_name": "Klinik Primer Cyberjaya", "category": "Perkhidmatan Kesihatan", "status": "Lesen Aktif", "payment_status": "Berbayar", "location": "Glomac Cyberjaya", "last_inspected": "2026-01-10" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [101.6499, 2.9188] },
      "properties": { "license_id": "MPSepang-2026-0102D", "premise_name": "Pasaraya Segar Bestari", "category": "Runcit / Pasar raya", "status": "Lesen Aktif", "payment_status": "Berbayar", "location": "NeoCyber", "last_inspected": "2026-04-05" }
    },
    {
      "type": "Feature",
      "geometry": { "type": "Point", "coordinates": [101.6601, 2.9290] },
      "properties": { "license_id": "MPSepang-2025-5021E", "premise_name": "Cyber Tech Repair (Penjaja)", "category": "Penjaja / Kiosk", "status": "Lesen Tamat", "payment_status": "Tertunggak", "location": "Jalan Teknokrat 3", "last_inspected": "2025-09-12" }
    }
  ]
};

const hawkerData = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6410, 2.9280] }, "properties": { "intensity": 0.9 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6425, 2.9275] }, "properties": { "intensity": 0.8 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6548, 2.9213] }, "properties": { "intensity": 0.95 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6555, 2.9220] }, "properties": { "intensity": 0.7 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6499, 2.9188] }, "properties": { "intensity": 0.6 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6505, 2.9195] }, "properties": { "intensity": 0.5 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6380, 2.9300] }, "properties": { "intensity": 0.4 } }
  ]
};

const arrearsData = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6350, 2.9080] }, "properties": { "intensity": 1.0 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6360, 2.9090] }, "properties": { "intensity": 0.85 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6345, 2.9075] }, "properties": { "intensity": 0.75 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6530, 2.9240] }, "properties": { "intensity": 0.9 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6520, 2.9235] }, "properties": { "intensity": 0.6 } },
    { "type": "Feature", "geometry": { "type": "Point", "coordinates": [101.6250, 2.9050] }, "properties": { "intensity": 0.5 } }
  ]
};

const hawkerPoints: [number, number, number][] = hawkerData.features.map(f => [f.geometry.coordinates[1], f.geometry.coordinates[0], f.properties.intensity]);
const arrearsPoints: [number, number, number][] = arrearsData.features.map(f => [f.geometry.coordinates[1], f.geometry.coordinates[0], f.properties.intensity]);

const hawkerOptions = { radius: 35, blur: 20, maxZoom: 17, minOpacity: 0.6, gradient: { 0.1: '#fde047', 0.5: '#f97316', 1: '#ef4444' } }; // Yellow to Red
const arrearsOptions = { radius: 45, blur: 25, maxZoom: 17, minOpacity: 0.6, gradient: { 0.1: '#a855f7', 0.5: '#9f1239', 1: '#4c0519' } }; // Purple to Deep Red

function MapEvents({ setCenter, onMapClick }: { setCenter: (center: L.LatLng) => void, onMapClick: () => void }) {
  const map = useMapEvents({
    move: () => setCenter(map.getCenter()),
    click: onMapClick,
  });
  return null;
}

function HeatmapLayer({ points, options }: { points: [number, number, number][], options: any }) {
  const map = useMap();

  useEffect(() => {
    let heatLayer: any = null;
    let mounted = true;

    import("leaflet.heat").then(() => {
      if (mounted) {
        heatLayer = (L as any).heatLayer(points, options).addTo(map);
      }
    }).catch(err => console.error("Failed to load leaflet.heat", err));

    return () => {
      mounted = false;
      if (heatLayer) {
        map.removeLayer(heatLayer);
      }
    };
  }, [map, points, options]);

  return null;
}

const createCustomIcon = (paymentStatus: string, isSelected: boolean) => {
  let colorClass = "bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]";
  if (paymentStatus === "Berbayar") colorClass = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
  if (paymentStatus === "Tertunggak") colorClass = "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]";

  const sizeClass = isSelected ? "w-6 h-6 border-4" : "w-5 h-5 border-2";

  return L.divIcon({
    className: "custom-div-icon bg-transparent border-none",
    html: `<div class="${sizeClass} rounded-full ${colorClass} border-white flex items-center justify-center transition-all duration-300"></div>`,
    iconSize: isSelected ? [24, 24] : [20, 20],
    iconAnchor: isSelected ? [12, 12] : [10, 10],
  });
};

export default function MapComponent() {
  // Center on Cyberjaya
  const [center, setCenter] = useState<L.LatLng>(new L.LatLng(2.9228, 101.6514));
  
  // Layer Panel UI State
  const [analitikPintarOpen, setAnalitikPintarOpen] = useState(true);
  const [pelesenanOpen, setPelesenanOpen] = useState(false);
  const [pentadbiranOpen, setPentadbiranOpen] = useState(false);
  const [infrastrukturOpen, setInfrastrukturOpen] = useState(false);
  const [petaDasarOpen, setPetaDasarOpen] = useState(true);

  // Filter State
  const [showHawkerHeatmap, setShowHawkerHeatmap] = useState(false);
  const [showArrearsHeatmap, setShowArrearsHeatmap] = useState(false);
  const [showAktif, setShowAktif] = useState(true);
  const [showTamat, setShowTamat] = useState(true);
  const [baseMap, setBaseMap] = useState<'osm' | 'satellite' | 'dark'>('dark');

  // Custom Popup State
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const filteredFeatures = geojsonData.features.filter(feature => {
    if (feature.properties.status === "Lesen Aktif" && !showAktif) return false;
    if (feature.properties.status === "Lesen Tamat" && !showTamat) return false;
    return true;
  });

  return (
    <div className="h-full w-full relative">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-[1000] h-14 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm">
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Paparan Premis (Pelesenan)
        </h1>
        <div className="flex items-center gap-2 text-sm font-mono text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-inner">
          <span>Lat: {center.lat.toFixed(4)}</span>
          <span className="text-slate-300 mx-1">|</span>
          <span>Lng: {center.lng.toFixed(4)}</span>
        </div>
      </div>

      {/* Right Layer Control Panel */}
      <div className="absolute right-4 top-20 w-72 z-[1000] bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[calc(100vh-6rem)]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Kawalan Lapisan (Layers)</h2>
        </div>
        
        <div className="overflow-y-auto flex-1 p-2 space-y-2 text-sm">
          
          {/* ANALITIK PINTAR */}
          <div className="border border-indigo-100 dark:border-indigo-900/50 rounded-lg overflow-hidden">
            <button 
              onClick={() => setAnalitikPintarOpen(!analitikPintarOpen)}
              className="w-full flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 transition-colors text-indigo-800 dark:text-indigo-300 font-bold"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <span>ANALITIK PINTAR</span>
              </div>
              {analitikPintarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {analitikPintarOpen && (
              <div className="p-3 space-y-3 bg-white dark:bg-slate-900 border-t border-indigo-50 dark:border-indigo-900/30">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={showHawkerHeatmap} 
                    onChange={(e) => setShowHawkerHeatmap(e.target.checked)} 
                    className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 cursor-pointer" 
                  />
                  <div className="flex flex-col">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Kepadatan Penjaja</span>
                    <span className="text-xs text-slate-400">Peta haba lokasi tumpuan</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={showArrearsHeatmap} 
                    onChange={(e) => setShowArrearsHeatmap(e.target.checked)} 
                    className="w-4 h-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer" 
                  />
                  <div className="flex flex-col">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">Tunggakan Cukai</span>
                    <span className="text-xs text-slate-400">Kawasan kritikal tunggakan</span>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* PELESENAN */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setPelesenanOpen(!pelesenanOpen)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium"
            >
              <span>PELESENAN</span>
              {pelesenanOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {pelesenanOpen && (
              <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Premis Pelesenan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Premis Sewaan</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={showAktif} 
                    onChange={(e) => setShowAktif(e.target.checked)} 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Lesen Aktif</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={showTamat} 
                    onChange={(e) => setShowTamat(e.target.checked)} 
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Lesen Tamat</span>
                </label>
              </div>
            )}
          </div>

          {/* PENTADBIRAN */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setPentadbiranOpen(!pentadbiranOpen)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium"
            >
              <span>PENTADBIRAN</span>
              {pentadbiranOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {pentadbiranOpen && (
              <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Lot NDCDB</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Gunatanah Semasa</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Zon Gunatanah</span>
                </label>
              </div>
            )}
          </div>

          {/* INFRASTRUKTUR */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setInfrastrukturOpen(!infrastrukturOpen)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium"
            >
              <span>INFRASTRUKTUR</span>
              {infrastrukturOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {infrastrukturOpen && (
              <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Rangkaian Paip Air</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Lampu Jalan</span>
                </label>
              </div>
            )}
          </div>

          {/* PETA DASAR */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            <button 
              onClick={() => setPetaDasarOpen(!petaDasarOpen)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium"
            >
              <span>PETA DASAR</span>
              {petaDasarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {petaDasarOpen && (
              <div className="p-3 space-y-3 bg-white dark:bg-slate-900">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="basemap" 
                    checked={baseMap === 'osm'} 
                    onChange={() => setBaseMap('osm')} 
                    className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">OpenStreetMap</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="basemap" 
                    checked={baseMap === 'satellite'} 
                    onChange={() => setBaseMap('satellite')} 
                    className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Satelit</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="basemap" 
                    checked={baseMap === 'dark'} 
                    onChange={() => setBaseMap('dark')} 
                    className="w-4 h-4 border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200">Peta Gelap</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Left Legend */}
      <div className="absolute left-4 bottom-6 z-[1000] bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 w-48 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 transition-all duration-300">
        <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 mb-3 tracking-wider">STATUS BAYARAN</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Lesen Aktif</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Tertunggak</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-3 h-3 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]"></div>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Premis</span>
          </div>
        </div>
      </div>

      {/* Custom Floating Popup Card */}
      {selectedFeature && (
        <div className="absolute bottom-6 right-80 z-[1000] w-80 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 transform transition-all animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight pr-4">
              {selectedFeature.properties.premise_name}
            </h3>
            <button 
              onClick={() => setSelectedFeature(null)} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
            selectedFeature.properties.status === "Lesen Aktif" 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" 
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
          }`}>
            {selectedFeature.properties.status}
          </span>
          
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">ID Lesen:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{selectedFeature.properties.license_id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Kategori:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{selectedFeature.properties.category}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 dark:text-slate-400">Status Bayaran:</span>
              <span className={`font-semibold ${
                selectedFeature.properties.payment_status === "Berbayar" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              }`}>
                {selectedFeature.properties.payment_status}
              </span>
            </div>
          </div>
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 text-sm">
            Lihat Profil Lengkap
          </button>
        </div>
      )}

      {/* Map Container */}
      <MapContainer
        center={[2.9228, 101.6514]}
        zoom={14}
        zoomControl={false}
        className="h-full w-full z-0"
      >
        <MapEvents setCenter={setCenter} onMapClick={() => setSelectedFeature(null)} />
        
        {baseMap === 'osm' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        {baseMap === 'satellite' && (
          <TileLayer
            attribution='Tiles &copy; Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )}

        {baseMap === 'dark' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        )}

        {/* Heatmap Layers */}
        {showHawkerHeatmap && <HeatmapLayer points={hawkerPoints} options={hawkerOptions} />}
        {showArrearsHeatmap && <HeatmapLayer points={arrearsPoints} options={arrearsOptions} />}

        {filteredFeatures.map((feature, idx) => {
          const isSelected = selectedFeature?.properties.license_id === feature.properties.license_id;
          return (
            <Marker 
              key={idx} 
              position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
              icon={createCustomIcon(feature.properties.payment_status, isSelected)}
              eventHandlers={{
                click: () => setSelectedFeature(feature)
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
