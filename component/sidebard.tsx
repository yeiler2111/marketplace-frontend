"use client";

import Cookies from "js-cookie";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const links = [
    { href: "/dashboard", label: "📊 Dashboard", exact: true },
    { href: "/dashboard/product", label: "📦 Productos" },
    { href: "/dashboard/orders", label: "📑 Pedidos" },
    { href: "/dashboard/car", label: "🛍️ Ver Carrito", isButton: true },
  ];

  const renderLink = ({
    href,
    label,
    isButton = false,
    exact = false,
  }: any) => {
    const isActive = exact ? pathname === href : pathname.startsWith(href);
    const className = isButton
      ? `btn w-100 ${isActive ? "btn-light text-dark" : "btn-outline-light"}`
      : `nav-link text-white ${isActive ? "active" : ""}`;

    return (
      <Link key={href} href={href} className={className}>
        {label}
      </Link>
    );
  };
  const handleLogout = async () => {
  const token = Cookies.get("token");

  if (status === "authenticated") {
    Cookies.remove("token");
    await signOut({ callbackUrl: "/auth/login" });
  } else if (token) {
    Cookies.remove("token");
    router.push("/auth/login");
  } else {
    router.push("/auth/login");
  }
};


  return (
    <>
      {/* NAVBAR (Mobile) */}
      <nav className="navbar navbar-dark bg-dark d-md-none">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasSidebar"
            aria-controls="offcanvasSidebar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <span className="navbar-brand">🛒 Marketplace</span>
        </div>
      </nav>

      {/* OFFCANVAS (Mobile Sidebar) */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex={-1}
        id="offcanvasSidebar"
        aria-labelledby="offcanvasSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="text-white">🛒 Marketplace</h5>
          <h3>{session?.user?.email}</h3>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          <nav className="nav nav-pills flex-column mb-auto">
            {links.slice(0, -1).map(renderLink)}
          </nav>
          <div className="mt-auto">
            {renderLink(links[links.length - 1])}
            <button
              className="btn btn-outline-light w-100 mt-2"
              onClick={handleLogout}
            >
              🔒 Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR (Desktop) */}
      <aside
        className="bg-dark text-white vh-100 p-3 d-none d-md-flex flex-column"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "220px",
          zIndex: 1030,
          overflow: "hidden",
        }}
      >
        <h4 className="text-center mb-4">🛒 Marketplace</h4>
        <nav className="nav nav-pills flex-column mb-auto">
          {links.slice(0, -1).map(renderLink)}
        </nav>
        <div className="mt-auto">
          {renderLink(links[links.length - 1])}
          <button
            className="btn btn-outline-light w-100 mt-2"
            onClick={handleLogout}
          >
            🔒 Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
