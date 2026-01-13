// ==========================================
// 📁 src/app/(admin)/_components/admin-sidebar.tsx
// ==========================================
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookText,
  Tags,
  Users,
  MessageSquare,
  Video,
  LogOut,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/components/mode-toggle";
import type { Session } from "../../../server/better-auth/config";
import { signOutAction } from "../../actions/auth";
import { SignOutButton } from "../../../components/sign-out-button";


interface AdminSidebarProps {
  session: Session;
}

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "Manage Books", icon: BookText },
  { href: "/admin/genres", label: "Manage Genres", icon: Tags },
  { href: "/admin/users", label: "Manage Users", icon: Users },
  { href: "/admin/reviews", label: "Moderate Reviews", icon: MessageSquare },
  { href: "/admin/tutorials", label: "Manage Tutorials", icon: Video },
];

export function AdminSidebar({ session }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <aside className="hidden w-64 flex-col border-r border-border bg-card md:flex">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <span className="font-poppins text-lg font-bold tracking-tight">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }
              `}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-border p-4 space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <ModeToggle />
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
          {session.user.image ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={session.user.image}
                alt={session.user.name || "Admin"}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {session.user.name?.[0] || "A"}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{session.user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              Administrator
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <SignOutButton className="text-destructive hover:bg-destructive/10 hover:text-destructive" />
      </div>
    </aside>
  );
}