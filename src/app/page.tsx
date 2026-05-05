"use client";

import dynamic from "next/dynamic";
import DashboardLayout from "@/components/DashboardLayout";

// Dynamically import MapComponent to disable SSR
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-slate-400 font-medium">Memuatkan Peta...</span>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <DashboardLayout>
      <div className="h-full w-full">
        <MapComponent />
      </div>
    </DashboardLayout>
  );
}
