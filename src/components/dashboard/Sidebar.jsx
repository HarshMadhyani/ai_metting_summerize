import Logo from "./Logo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-900 bg-slate-950 p-6">
      <Logo />

      <div className="mt-10 flex-1 overflow-y-auto pr-1 -mr-1">
        <NavLinks />
      </div>

      <UserMenu />
    </aside>
  );
}