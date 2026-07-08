"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/constants/navigation";
import { motion } from "framer-motion";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1.5">
      {NAV_LINKS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.title}
            href={item.href}
            className="relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors duration-200 group"
          >
            {active && (
              <motion.div
                layoutId="active-nav-bg"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/15 to-indigo-600/10 border-l-2 border-blue-500"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            
            <Icon 
              size={18} 
              className={`relative z-10 transition-transform duration-200 group-hover:scale-115 ${
                active ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
              }`} 
            />
            <span 
              className={`relative z-10 transition-colors duration-200 ${
                active ? "text-white font-semibold" : "text-slate-400 group-hover:text-slate-200"
              }`}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
