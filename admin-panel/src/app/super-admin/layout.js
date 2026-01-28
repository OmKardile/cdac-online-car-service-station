import SuperAdminSidebar from "@/components/SuperAdminSidebar";

export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <SuperAdminSidebar />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
