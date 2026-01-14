// ==========================================
// 📁 src/app/(user)/dashboard/_components/dashboard-greeting.tsx
// ==========================================
"use client";

import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";

interface DashboardGreetingProps {
  userName: string;
}

export function DashboardGreeting({ userName }: DashboardGreetingProps) {
  const [greeting, setGreeting] = useState({ text: "Hello", Icon: Sun });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting({ text: "Good morning", Icon: Sunrise });
    } else if (hour >= 12 && hour < 17) {
      setGreeting({ text: "Good afternoon", Icon: Sun });
    } else if (hour >= 17 && hour < 21) {
      setGreeting({ text: "Good evening", Icon: Sunset });
    } else {
      setGreeting({ text: "Good night", Icon: Moon });
    }
  }, []);

  const { text, Icon } = greeting;

  return (
    <div className="flex items-center gap-3">
      <Icon className="h-8 w-8 text-primary" />
      <div>
        <h1 className="font-poppins text-3xl font-bold text-foreground">
          {text}, {userName}!
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to your reading journey
        </p>
      </div>
    </div>
  );
}