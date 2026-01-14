import { Suspense } from "react"

import { redirect } from "next/navigation"
import type { ShelfType } from "../../../../../generated/prisma"
import { getSession } from "../../../../server/better-auth/server"
import { ShelfBookGridSkeleton } from "./_components/shelf-book-grid-skeleton"
import { ShelfContent } from "./_components/library-content"
import { LibraryTabs } from "./_components/library-tabs"


interface LibraryPageProps {
  searchParams: Promise<{ shelf?: string }>
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const session = await getSession()
  if (!session) redirect("/login")

  const params = await searchParams
  // Default to CURRENTLY_READING as it's the most actionable shelf
  const currentShelf = (params.shelf as ShelfType) || "CURRENTLY_READING"

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Static Header - Never reloads */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-poppins tracking-tight text-foreground">
          My Library
        </h1>
        <p className="text-muted-foreground">
          Track your reading journey and manage your collection.
        </p>
      </div>

      {/* Static Tabs - Never reloads */}
      <LibraryTabs currentShelf={currentShelf} />

      {/* Dynamic Content - Shows Skeleton only here when switching tabs */}
      <div className="min-h-100">
        <Suspense key={currentShelf} fallback={<ShelfBookGridSkeleton />}>
          <ShelfContent userId={session.user.id} shelf={currentShelf} />
        </Suspense>
      </div>
    </div>
  )
}