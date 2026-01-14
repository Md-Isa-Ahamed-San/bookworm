import { redirect } from "next/navigation"
import { Suspense } from "react"
import { getSession } from "../../../../server/better-auth/server"
import { BooksTableSkeleton } from "./_components/books-table-skeleton"
import { BooksTable } from "./_components/books-table"

export default async function BooksPage() {
  const session = await getSession()
  
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Manage Books
        </h1>
        <p className="text-muted-foreground mt-2">
          Add, edit, and manage books in your library
        </p>
      </div>

      {/* <Suspense fallback={<BooksTableSkeleton />}> */}
        <BooksTable />
      {/* </Suspense> */}
    </div>
  )
}