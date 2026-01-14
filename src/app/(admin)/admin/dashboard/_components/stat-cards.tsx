// src/app/(admin)/dashboard/_components/stat-cards.tsx
import { BookOpen, Users, MessageSquare, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"

interface StatCardsProps {
  counts: {
    books: number
    users: number
    pendingReviews: number
    genres: number
  }
}

export function StatCards({ counts }: StatCardsProps) {
  const stats = [
    {
      title: "Total Books",
      value: counts.books,
      icon: BookOpen,
      description: "Books in library",
      color: "text-blue-500",
    },
    {
      title: "Total Users",
      value: counts.users,
      icon: Users,
      description: "Registered readers",
      color: "text-indigo-500",
    },
    {
      title: "Pending Reviews",
      value: counts.pendingReviews,
      icon: MessageSquare,
      description: "Requires moderation",
      alert: counts.pendingReviews > 0,
      color: "text-orange-500",
    },
    {
      title: "Total Genres",
      value: counts.genres,
      icon: Tag,
      description: "Active categories",
      color: "text-emerald-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card 
          key={stat.title} 
          className={`border-border/60 shadow-sm transition-all hover:shadow-md ${
            stat.alert ? "border-orange-500/50 bg-orange-500/5" : "bg-card"
          }`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.alert ? "text-orange-500" : stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-poppins">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}