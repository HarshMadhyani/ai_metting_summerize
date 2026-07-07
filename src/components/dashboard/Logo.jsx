import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
        M
      </div>

      <div>
        <h1 className="text-lg font-bold">MeetMind AI</h1>
        <p className="text-xs text-slate-400">
          AI Meeting Assistant
        </p>
      </div>
    </Link>
  );
}