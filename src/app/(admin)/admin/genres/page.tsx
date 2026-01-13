import { Suspense } from "react"
import { getSession } from "../../../../server/better-auth/server"
import { redirect } from "next/navigation"
import { GenresTableSkeleton } from "./_components/genres-table-skeleton"
import { GenresTable } from "./_components/genres-table"


export default async function GenresPage() {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Manage Genres
        </h1>
        <p className="text-muted-foreground mt-2">
          Create and manage book genres for your library
        </p>
      </div>

      <Suspense fallback={<GenresTableSkeleton />}>
        <GenresTable />
      </Suspense>
    </div>
  )
}