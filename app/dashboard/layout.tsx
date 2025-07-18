'use client'
// app/dashboard/layout.tsx
import Sidebar from "@/component/sidebard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-3 p-0">
          <Sidebar />
        </div>

        <div className="col-12 col-md-9 p-4 bg-light min-vh-100">
          {children}
        </div>
      </div>
    </div>
  );
}
