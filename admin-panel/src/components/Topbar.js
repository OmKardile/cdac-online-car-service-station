"use client";

import { useRouter } from "next/navigation";

export default function Topbar({ title }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-red-500 font-medium"
      >
        Logout
      </button>
    </header>
  );
}
