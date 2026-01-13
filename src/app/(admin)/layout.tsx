// ==========================================
// 📁 src/app/(admin)/layout.tsx
// ==========================================
import { redirect } from "next/navigation";
import { getSession } from "../../server/better-auth/server";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminMobileHeader } from "./_components/admin-mobile-header";


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Double-check admin role
  if (!session || session.user.role !== "ADMIN") {
    redirect("/user/library");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AdminSidebar session={session} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <AdminMobileHeader session={session} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}