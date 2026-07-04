import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Layout = () => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />
    <main className="flex-1 overflow-x-hidden">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <Outlet />
      </div>
    </main>
  </div>
);

export default Layout;
