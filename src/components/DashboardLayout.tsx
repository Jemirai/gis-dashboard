import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-900 overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 h-full relative">
        {children}
      </main>
    </div>
  );
}
