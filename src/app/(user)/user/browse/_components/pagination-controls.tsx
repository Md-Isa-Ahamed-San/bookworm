// src/app/(user)/user/browse/_components/pagination-controls.tsx
"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "~/components/ui/button"

interface PaginationControlsProps {
  metadata: {
    page: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function PaginationControls({ metadata }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { page, totalPages, hasNextPage, hasPrevPage } = metadata

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`/user/browse?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPrevPage}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      <span className="text-sm font-medium text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNextPage}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  )
}