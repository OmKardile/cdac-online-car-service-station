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
      <h1 className="text-lg font-semibold"> ~ // {title}</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-white hover:text-red-500 hover:bg-gray-100 border-2 rounded-2xl border-amber-700 font-medium  bg-orange-800 px-4 py-2"
      >
        LOGOUT
      </button>
    </header>
  );
}
