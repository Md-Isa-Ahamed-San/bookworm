// src/app/(admin)/dashboard/page.tsx
"use client"


import { StatCards } from "./_components/stat-cards"
import { BooksPerGenreChart } from "./_components/books-per-genre-chart"
import { RecentReviewsTable } from "./_components/recent-reviews-table"
import { DashboardSkeleton } from "./_components/dashboard-skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { Button } from "~/components/ui/button"
import { useAdminStats } from "../../../../hooks/admin/use-admin-stats"

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error, refetch } = useAdminStats()

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight font-poppins text-foreground">
            Dashboard
          </h1>
        </div>
        <DashboardSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load dashboard data."}
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight font-poppins text-foreground">
          Dashboard
        </h1>
      </div>

      {data && (
        <>
          <StatCards counts={data.counts} />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <BooksPerGenreChart data={data.booksPerGenre} />
            <RecentReviewsTable reviews={data.recentReviews} />
          </div>
        </>
      )}
    </div>
  )
}