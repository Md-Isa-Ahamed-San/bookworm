// ==========================================
// 📁 src/app/(admin)/_components/admin-sidebar.tsx
// ==========================================
"use client";

import {
  BookText,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Tags,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "~/components/mode-toggle";
import { signOutAction } from "../../../actions/auth";
import { SignOutButton } from "../../../components/sign-out-button";
import type { Session } from "../../../server/better-auth/config";

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

  return (
    <aside className="border-border bg-card hidden h-screen w-64 sticky top-0 flex-col border-r md:flex">
      {" "}
      {/* ← CHANGE 1: Added h-screen */}
      {/* Header */}
      <div className="border-border flex h-16 items-center gap-2 border-b px-6">
        <ShieldCheck className="text-primary h-6 w-6" />
        <span className="font-poppins text-lg font-bold tracking-tight">
          Admin Panel
        </span>
      </div>
      {/* Navigation - Scrollable */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {" "}
        {/* ← Already correct! */}
        {adminLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              } `}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      {/* User Section - Fixed at Bottom */}
      <div className="border-border space-y-4 border-t p-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">
            Theme
          </span>
          <ModeToggle />
        </div>

        {/* User Info */}
        <div className="bg-accent/50 flex items-center gap-3 rounded-lg p-3">
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
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
              {session.user.name?.[0] || "A"}
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">{session.user.name}</p>
            <p className="text-muted-foreground truncate text-xs">
              Administrator
            </p>
          </div>
        </div>

        <SignOutButton className="text-destructive hover:bg-destructive/10 hover:text-destructive" />
      </div>
    </aside>
  );
}
