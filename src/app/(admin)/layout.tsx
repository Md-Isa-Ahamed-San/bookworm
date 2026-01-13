import Link from "next/link";
import {
  LayoutDashboard,
  BookText,
  Tags,
  Users,
  MessageSquare,
  Video,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import { signOutAction } from "../actions/auth";
import { ModeToggle } from "../../components/mode-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Extra security check
  if (!session || session.user.role !== 'ADMIN') {
    redirect("/library");
  }

  const adminLinks = [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/books", label: "Manage Books", icon: BookText },
    { href: "/admin/genres", label: "Manage Genres", icon: Tags },
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/reviews", label: "Moderate Reviews", icon: MessageSquare },
    { href: "/admin/tutorials", label: "Manage Tutorials", icon: Video },
  ];

  return (
    <div className="bg-background font-poppins flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="border-border bg-card hidden w-64 flex-col border-r md:flex">
        <div className="border-border flex h-16 items-center gap-2 border-b px-6">
          <ShieldCheck className="text-primary h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="border-border border-t p-4">
          <ModeToggle />
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full font-bold">
              {session.user.name?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-sm font-medium">
                {session.user.name}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                Administrator
              </p>
            </div>
          </div>
          <form action={signOutAction}>
            <button className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col">
        <header className="border-border bg-background flex h-16 items-center justify-between border-b px-8 md:hidden">
          {/* Mobile Header (Simplified) */}
          <span className="text-primary font-bold">BookWorm Admin</span>
          <form action={signOutAction}>
            <button>
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
