"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function UserMenu() {
  const { user, isLoaded } = useUser();

  return (
    <div className="border-t border-slate-900 pt-4 mt-auto">
      {isLoaded && user ? (
        <div className="flex items-center gap-3 rounded-xl p-2 bg-slate-900/30 border border-slate-900/50 hover:bg-slate-900/50 transition duration-200">
          <div className="flex-shrink-0">
            <UserButton afterSignOutUrl="/sign-in" appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9 border border-slate-800"
              }
            }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">
              {user.fullName || user.username || "User"}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {user.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-xl p-2 animate-pulse bg-slate-900/10">
          <div className="h-9 w-9 rounded-full bg-slate-900" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-20 rounded bg-slate-900" />
            <div className="h-2 w-28 rounded bg-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}