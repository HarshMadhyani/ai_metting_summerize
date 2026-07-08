import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto p-8">{children}</main>
    </div>
  );
}