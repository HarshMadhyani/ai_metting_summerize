"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {NAV_LINKS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.title}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
              active
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={20} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}