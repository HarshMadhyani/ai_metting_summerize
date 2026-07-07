import { UserButton } from "@clerk/nextjs";

export default function UserMenu() {
  return (
    <div className="border-t border-slate-800 pt-4">
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}