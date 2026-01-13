import Link from "next/link";
import { BookOpen, Library, PlayCircle, Search, User as UserIcon, LogOut } from "lucide-react";
import { getSession } from "~/server/better-auth/server";
import { redirect } from "next/navigation";
import { signOutAction } from "../actions/auth"; // Your signout server action

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const navLinks = [
    { href: "/user/library", label: "My Library", icon: Library },
    { href: "/user/browse", label: "Browse", icon: Search },
    { href: "/user/tutorials", label: "Tutorials", icon: PlayCircle },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-poppins text-foreground">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight text-primary">BookWorm</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-sm font-semibold leading-none">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <form action={signOutAction}>
              <button className="rounded-full p-2 hover:bg-accent text-muted-foreground hover:text-destructive transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BookWorm. Built for book lovers.
          </p>
        </div>
      </footer>
    </div>
  );
}