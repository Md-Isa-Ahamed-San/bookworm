"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            bg-card hover:bg-primary/10 active:bg-primary/20
            text-foreground dark:text-card-foreground
            shadow-sm hover:shadow-md
            transition-all duration-150
            rounded-lg
          "
        >
          <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" />
          <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
          bg-card dark:bg-card shadow-md rounded-lg
          border border-border dark:border-border
          animate-in slide-in-from-top-2
        "
      >
        <DropdownMenuItem
          className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
