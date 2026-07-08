import Link from "next/link";
import { Brain } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3 group">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Brain className="relative h-5 w-5 animate-pulse" />
      </div>

      <div>
        <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
          MeetMind <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
          Meeting Intelligence
        </p>
      </div>
    </Link>
  );
}