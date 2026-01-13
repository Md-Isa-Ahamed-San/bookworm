// ==========================================
// 📁 src/components/footer.tsx
// ==========================================
import Link from "next/link";
import { BookOpen, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-poppins font-bold text-primary">
                BookWorm
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your personal reading companion. Discover, track, and share your
              love for books.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-poppins font-bold text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/user/browse"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  href="/user/library"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  My Library
                </Link>
              </li>
              <li>
                <Link
                  href="/user/tutorials"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h3 className="font-poppins font-bold text-sm">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@bookworm.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-colors hover:bg-accent"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} BookWorm. Built for book lovers.
        </div>
      </div>
    </footer>
  );
}
