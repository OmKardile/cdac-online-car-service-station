"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/super-admin/dashboard" },
    { name: "Manage Admins", href: "/super-admin/manage-admins" },
    { name: "All Bookings", href: "/super-admin/bookings" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 min-h-screen px-6 py-8">
      <h2 className="text-xl font-semibold text-white mb-10">
        Super Admin
      </h2>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg transition ${
              pathname === link.href
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
