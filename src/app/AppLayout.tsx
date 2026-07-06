import { Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/components/Sidebar";
import { Topbar } from "@/shared/components/Topbar";
import { Logo } from "@/shared/components/Logo";

export function AppLayout() {
  return (
    <div className="app-shell__viewport">
      <header className="app-shell__brand px-6 py-4">
        <Logo />
      </header>

      <div className="app-shell">
        <Sidebar />
        <div className="app-shell__main">
          <Topbar />
          <main className="app-shell__content scroll-panel">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
