"use client";

import { Home, MapPin, BarChart2, Maximize, Power, User } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col z-20 shadow-xl relative text-slate-300">
      <div className="p-6 border-b border-slate-800 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
          <User size={20} className="text-slate-300" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-slate-400">Selamat datang,</span>
          <span className="font-semibold text-slate-100">administrator</span>
        </div>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto">
        <div className="flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
          <Home size={22} />
          <span>Panel Utama</span>
        </div>
        
        <div className="flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 bg-gradient-to-r from-blue-900/50 to-transparent border-l-4 border-blue-500 text-blue-400 font-medium">
          <MapPin size={22} />
          <span>Maklumat Premis</span>
        </div>
        
        <div className="flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
          <BarChart2 size={22} />
          <span>Laporan</span>
        </div>
        
        <div className="flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
          <Maximize size={22} />
          <span>Skrin Penuh</span>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 text-red-400 hover:bg-red-950/50 hover:text-red-300">
          <Power size={22} />
          <span>Keluar</span>
        </div>
      </div>
    </aside>
  );
}
