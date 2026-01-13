// ==========================================
// 📁 src/app/(admin)/_components/admin-mobile-header.tsx (UPDATED)
// ==========================================
"use client";

import { useState } from "react";
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
  Menu,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ModeToggle } from "~/components/mode-toggle";
import { signOutAction } from "../../actions/auth";
import type { Session } from "../../../server/better-auth/config";
import { SignOutButton } from "../../../components/sign-out-button";


interface AdminMobileHeaderProps {
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

export function AdminMobileHeader({ session }: AdminMobileHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <span className="font-poppins font-bold text-primary">
          Admin Panel
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex flex-col gap-6">
              {/* User Info */}
              <div className="flex items-center gap-3 border-b border-border pb-4">
                {session.user.image ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Admin"}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {session.user.name?.[0] || "A"}
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-2">
                {adminLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                        ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }
                      `}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Sign Out */}
              <SignOutButton 
  className="mt-auto text-destructive hover:bg-destructive/10 hover:text-destructive" 
/>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
