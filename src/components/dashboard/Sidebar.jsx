import Logo from "./Logo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-900 p-6">
      <Logo />

      <div className="mt-10 flex-1">
        <NavLinks />
      </div>

      <UserMenu />
    </aside>
  );
}