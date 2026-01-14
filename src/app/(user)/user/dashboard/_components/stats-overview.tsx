// ==========================================
// 📁 src/app/(user)/dashboard/_components/stats-overview.tsx
// ==========================================
import { Card, CardContent } from "~/components/ui/card";
import { BookOpen, BookMarked, Clock } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    booksRead: number;
    wantToRead: number;
    currentlyReading: number;
    totalBooks: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      label: "Books Read",
      value: stats.booksRead,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Currently Reading",
      value: stats.currentlyReading,
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Want to Read",
      value: stats.wantToRead,
      icon: BookMarked,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 font-poppins text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}