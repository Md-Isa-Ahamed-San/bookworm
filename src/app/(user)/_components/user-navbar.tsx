// ==========================================
// 📁 src/app/(user)/_components/user-navbar.tsx (UPDATED - ADD THEME TOGGLE)
// ==========================================
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Library,
  Search,
  PlayCircle,
  Menu,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { ModeToggle } from "~/components/mode-toggle";
import { signOutAction } from "../../actions/auth";
import type { Session } from "../../../server/better-auth/config";

interface UserNavbarProps {
  session: Session;
}

const navLinks = [
  { href: "/user/library", label: "My Library", icon: Library },
  { href: "/user/browse", label: "Browse Books", icon: Search },
  { href: "/user/tutorials", label: "Tutorials", icon: PlayCircle },
];

export function UserNavbar({ session }: UserNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-poppins text-xl font-bold tracking-tight text-primary">
            BookWorm
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  flex items-center gap-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle (Desktop) */}
          <div className="hidden md:block">
            <ModeToggle />
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 gap-2 rounded-full pl-2 pr-4"
                >
                  {session.user.image ? (
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <span className="hidden text-sm font-medium lg:inline">
                    {session.user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user/library" className="cursor-pointer">
                    <Library className="mr-2 h-4 w-4" />
                    My Library
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
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
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-sm font-medium">Theme</span>
                  <ModeToggle />
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
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

                {/* Sign Out Button */}
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="mt-auto justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}